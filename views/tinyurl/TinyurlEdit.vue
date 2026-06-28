<script setup lang="ts">
import { AdminLayout, BackButton, FormButtons, LoadingSpinner, toastService } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import InputField from '@admin/components/ui/InputField.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { tinyurlService, type TinyurlFormData } from '../../services/tinyurlService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)
const errors = ref<Record<string, string[]>>({})

const form = reactive<TinyurlFormData>({
  url: '',
  slug: '',
  redirect: null,
})

const fetchTinyurl = async () => {
  try {
    isLoading.value = true
    const { data } = await tinyurlService.getById(route.params.id as string)
    form.url = data.data.url
    form.slug = data.data.slug
    form.redirect = data.data.redirect
  } catch {
    toastService.error('Hiba történt a betöltés során.')
    await router.push('/admin/tinyurl')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    errors.value = {}
    await tinyurlService.update(route.params.id as string, form)
    toastService.success('Rövid URL sikeresen frissítve!')
    await router.push('/admin/tinyurl')
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

onMounted(fetchTinyurl)
</script>

<template>
  <AdminLayout page-title="Rövid URL szerkesztése">
    <div class="mb-4">
      <BackButton to="/admin/tinyurl" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <LoadingSpinner label="Betöltés..." />
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>Rövid URL adatai</CardTitle>
        <CardDescription>Módosítsd a rövid URL adatait.</CardDescription>
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
