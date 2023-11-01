import { useUserStore } from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Common from "@/Request/Modules/common";
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: '/home',
    name: 'home',
    component: () => import("@/views/AdminLoginPage.vue")
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/admin',
    meta: { isAuth : true },
    component: () => import("@/views/admin/AdminSystem.vue"),
    children: [
      {
        path: "/admin",
        name: "admin",
        meta: { isAuth : true },
        component: () => import("@/views/admin/MmAdmin.vue")
      },
      {
        path: "/AnimTest",
        name: "AnimTest",
        meta: { isAuth : true },
        component: () => import("@/views/test/AnimTest.vue")
      }
    ]
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import("@/components/NotFound.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach( async (to, from, next) => {
  // 需要验证登录
  if(to.meta.isAuth) {
    const { getToken } = useUserStore();
    // 验证Token有效性
    try {
      console.log("authtoken", getToken);
      const verift = await Common.vToken(getToken);
      if(verift)
        next();
      else next("/home");
    } catch (error) {
      next("/home");  
    }
  } else 
    next();
})

export default router
