import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface Tinyurl {
  id: number
  url: string
  slug: string
  redirect: string | null
  created_at: string
  updated_at: string
}

export interface TinyurlFormData {
  url: string
  slug: string
  redirect: string | null
}

export const tinyurlService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get('/api/admin/tinyurl/tinyurls', { params })
  },

  getById(id: number | string) {
    return api.get<{ data: Tinyurl }>(`/api/admin/tinyurl/tinyurls/${id}`)
  },

  create(data: TinyurlFormData) {
    return api.post<{ data: Tinyurl }>('/api/admin/tinyurl/tinyurls', data)
  },

  update(id: number | string, data: TinyurlFormData) {
    return api.put<{ data: Tinyurl }>(`/api/admin/tinyurl/tinyurls/${id}`, data)
  },

  delete(id: number | string) {
    return api.delete(`/api/admin/tinyurl/tinyurls/${id}`)
  },
}
