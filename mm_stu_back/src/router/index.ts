import { useUserStore } from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus';
import { RootRouterPath } from './root';

//都可以显示的路由
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/Home" },
  {
    path: '/Home',
    name: 'Home',
    component: () => import("@/views/AdminLoginPage.vue")
  },
  {
    path: '/System',
    name: 'System',
    redirect: '/Wellcome',
    meta: { isAuth: true },
    component: () => import("@/views/admin/AdminSystem.vue"),
    children: [
      {
        path: "/Wellcome",
        name: "Wellcome",
        meta: { isAuth: true },
        component: () => import("@/views/admin/WellComeView.vue")
      },
      {
        path: "/PersonalInfo",
        name: "PersonalInfo",
        meta: { isAuth: true },
        component: () => import("@/views/admin/personal/PersonalInfo.vue")
      },
      {
        path: "/AuthorizationMenu",
        name: "AuthorizationMenu",
        meta: { isAuth: true },
        component: () => import("@/views/admin/Authorization/AuthorizationMenu.vue")
      },
      {
        path: "/AuthorizationRole",
        name: "AuthorizationRole",
        meta: { isAuth: true },
        component: () => import("@/views/admin/Authorization/AuthorizationRole.vue")
      },
      {
        path: "/CollegeManager",
        name: "CollegeManager",
        meta: { isAuth: true },
        component: () => import("@/views/admin/info/CollegeManager.vue")
      },
      {
        path: "/ClassManager",
        name: "ClassManager",
        meta: { isAuth: true },
        component: () => import("@/views/admin/info/ClassManager.vue")
      },
      {
        path: "/AuthSystemUser",
        name: "AuthSystemUser",
        meta: { isAuth: true },
        component: () => import("@/views/admin/Authorization/AuthSystemUser.vue")
      },
      {
        path: "/TeacherManager",
        name: "TeacherManager",
        meta: { isAuth: true },
        component: () => import("@/views/admin/info/TeacherManager.vue")
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
router.addRoute("System", RootRouterPath["student.info"])


// 路由守卫
router.beforeEach(async (to, from, next) => {
  const { getToken } = useUserStore();
  if (to.name === "Home") {
    if(getToken) {
      ElMessage.info("已经登录了");
      console.log(from);
      next("/System")
    } else next();
  } else {
    // 需要验证登录
    if (to.meta.isAuth) {
      //验证Token有效性
      if (getToken) next();
      else {
        ElMessage.error("请登录");
        next("/Home");
      }
    } else next();
  }
})

export default router
