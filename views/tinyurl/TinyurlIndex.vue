<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import CreateButton from '@admin/components/ui/button/CreateButton.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tinyurlService } from '../../services/tinyurlService'

const router = useRouter()
const table = ref()

const quickUrl = ref('')
const quickTinyUrl = ref('')
const quickLoading = ref(false)

const handleQuickCreate = async () => {
  if (!quickUrl.value) return
  try {
    quickLoading.value = true
    const response = await tinyurlService.quickCreate(quickUrl.value)
    const slug = response.data.data.slug
    quickTinyUrl.value = `${window.location.origin}/tinyurl/${slug}`
    table.value?.refresh()
  } catch {
    toastService.error('Hiba történt a létrehozás során.')
  } finally {
    quickLoading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(quickTinyUrl.value)
    toastService.success('Vágólapra másolva!')
  } catch {
    toastService.error('Nem sikerült a vágólapra másolni.')
  }
}

const deleteTinyurl = async (id: number) => {
  try {
    await tinyurlService.delete(id)
    toastService.success('A rövid URL sikeresen törölve!')
    table.value?.refresh()
  } catch {
    toastService.error('Hiba történt a törlés során.')
  }
}
</script>

<template>
  <AdminLayout page-title="Rövid URL-ek">
    <div class="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex gap-2">
        <input
          v-model="quickUrl"
          type="url"
          placeholder="https://example.com/hosszú-url"
          class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          @keydown.enter="handleQuickCreate"
        />
        <button
          :disabled="quickLoading || !quickUrl"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleQuickCreate"
        >
          {{ quickLoading ? 'Folyamatban...' : 'Létrehoz' }}
        </button>
      </div>
      <div v-if="quickTinyUrl" class="mt-2 flex items-center gap-2">
        <span class="text-sm text-gray-500">Alias:</span>
        <input
          :value="quickTinyUrl"
          readonly
          class="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-mono text-gray-700"
        />
        <button
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
          title="Vágólapra másolás"
          @click="copyToClipboard"
        >
          Másolás
        </button>
      </div>
    </div>

    <DataTable
      ref="table"
      url="/api/admin/tinyurl/tinyurls"
    >
      <template #actions>
        <CreateButton to="/admin/tinyurl/create">Új rövid URL</CreateButton>
      </template>

      <template #row-actions="{ row }">
        <EditButton @click="router.push(`/admin/tinyurl/${(row as any).id}/edit`)" />
        <DeleteButton @confirm="deleteTinyurl((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető rövid URL.
      </template>
    </DataTable>
  </AdminLayout>
</template>
