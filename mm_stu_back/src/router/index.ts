import { useUserStore } from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus';
import { RootRouterPath } from './root';
import Common from "@/Request/Modules/common";
//都可以显示的路由
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
});

//当前是管理员
router.addRoute("system", RootRouterPath["student.info"])


// 路由守卫
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
      //验证Token有效性
      if (getToken) next();
      else {
        ElMessage.error("请登录");
        next("/home");
      }
    } else next();
  }
})

export default router
