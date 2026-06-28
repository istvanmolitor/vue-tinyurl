import type { RouteRecordRaw } from 'vue-router'

const tinyurlRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/tinyurl',
    name: 'tinyurl-dashboard',
    component: () => import('../views/tinyurl/TinyurlDashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/tinyurl/list',
    name: 'tinyurl-index',
    component: () => import('../views/tinyurl/TinyurlIndex.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/tinyurl/create',
    name: 'tinyurl-create',
    component: () => import('../views/tinyurl/TinyurlCreate.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/tinyurl/:id/edit',
    name: 'tinyurl-edit',
    component: () => import('../views/tinyurl/TinyurlEdit.vue'),
    meta: { requiresAuth: true },
  },
]

export default tinyurlRoutes
