<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tinyurlService, type TinyurlFormData } from '../../services/tinyurlService'

const router = useRouter()
const isSaving = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = reactive<TinyurlFormData>({
  url: '',
  slug: '',
  redirect: null,
})

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    const response: any = await tinyurlService.create(form)
    toastService.success('Rövid URL sikeresen létrehozva!')
    const createdId = response?.data?.data?.id
    if (createdId) {
      await router.push({ name: 'tinyurl-edit', params: { id: String(createdId) } })
    } else {
      await router.push('/admin/tinyurl')
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
      toastService.error('Kérlek javítsd a hibákat.')
    } else {
      toastService.error('Hiba történt a mentés során.')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminLayout page-title="Új rövid URL">
    <div class="mb-4">
      <BackButton to="/admin/tinyurl" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Rövid URL adatai</CardTitle>
        <CardDescription>Add meg az új rövid URL adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <InputField id="url" label="Cél URL" v-model="form.url" placeholder="https://example.com/hosszu-url" :errors="errors.url" />
        <InputField id="slug" label="Slug" v-model="form.slug" placeholder="rovid-nev" :errors="errors.slug" />
        <InputField id="redirect" label="Átirányítás URL" v-model="form.redirect" placeholder="https://masik-oldal.com (opcionális)" :errors="errors.redirect" />
      </CardContent>
      <CardFooter>
        <FormButtons :is-saving="isSaving" @save="handleSubmit" @cancel="router.push('/admin/tinyurl')" />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>
