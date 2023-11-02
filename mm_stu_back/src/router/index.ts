import { useUserStore } from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus';
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
    meta: { isAuth: true },
    component: () => import("@/views/admin/AdminSystem.vue"),
    children: [
      {
        path: "/admin",
        name: "admin",
        meta: { isAuth: true },
        component: () => import("@/views/admin/components/WelComeView.vue")
      },
      {
        path: "/AnimTest",
        name: "AnimTest",
        meta: { isAuth: true },
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

router.beforeEach(async (to, from, next) => {
  const { getToken } = useUserStore();
  if (to.name === "home") {
    if(getToken) {
      ElMessage.info("已经登录了");
      next("/system")
    } else next();
  } else {
    // 需要验证登录
    if (to.meta.isAuth) {
      // 验证Token有效性
      if (getToken) next();
      else next("/home");
    } else next();
  }
})

export default router
