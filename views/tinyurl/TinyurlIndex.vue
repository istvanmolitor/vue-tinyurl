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
