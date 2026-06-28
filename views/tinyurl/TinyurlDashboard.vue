<script setup lang="ts">
import { AdminLayout, toastService } from '@admin'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tinyurlService } from '../../services/tinyurlService'

const router = useRouter()

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
</script>

<template>
  <AdminLayout page-title="Rövid URL-ek">
    <div class="flex flex-col gap-6 max-w-xl">
      <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-base font-semibold text-gray-800">Gyors létrehozás</h2>
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
        <div v-if="quickTinyUrl" class="mt-3 flex items-center gap-2">
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

      <div>
        <button
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="router.push('/admin/tinyurl/list')"
        >
          Lista megtekintése
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
