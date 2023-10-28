import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/AdminLoginPage.vue")
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/admin',
    component: () => import("@/views/admin/AdminSystem.vue"),
    children: [
      {
        path: "/admin",
        name: "admin",
        component: () => import("@/views/admin/MmAdmin.vue")
      },
      {
        path: "/AnimTest",
        name: "AnimTest",
        component: () => import("@/views/test/AnimTest.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
