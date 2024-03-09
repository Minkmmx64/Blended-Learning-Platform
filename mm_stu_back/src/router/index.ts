import { useUserStore } from '@/store'
import { createRouter, createWebHistory, RouteRecordRaw, useRouter } from 'vue-router'
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
        meta: { isAuth: true, key: "Wellcome" },
        component: () => import("@/views/admin/WellComeView.vue")
      },
      {
        path: "/AdminInfoManager",
        name: "AdminInfoManager",
        meta: { isAuth: true, key: "AdminInfoManager" },
        component: () => import("@/views/admin/personal/PersonalInfo.vue")
      },
      {
        path: "/AuthorizationMenuManager",
        name: "AuthorizationMenuManager",
        meta: { isAuth: true, key: "AuthorizationMenuManager" },
        component: () => import("@/views/admin/Authorization/AuthorizationMenu.vue")
      },
      {
        path: "/AuthorizationRoleManager",
        name: "AuthorizationRoleManager",
        meta: { isAuth: true, key: "AuthorizationRoleManager" },
        component: () => import("@/views/admin/Authorization/AuthorizationRole.vue")
      },
      {
        path: "/CollegeManager",
        name: "CollegeManager",
        meta: { isAuth: true , key: "CollegeManager" },
        component: () => import("@/views/admin/info/CollegeManager.vue")
      },
      {
        path: "/ClassManager",
        name: "ClassManager",
        meta: { isAuth: true, key: "ClassManager" },
        component: () => import("@/views/admin/info/ClassManager.vue")
      },
      {
        path: "/SystemUserManager",
        name: "SystemUserManager",
        meta: { isAuth: true, key: "SystemUserManager" },
        component: () => import("@/views/admin/Authorization/AuthSystemUser.vue")
      },
      {
        path: "/TeacherManager",
        name: "TeacherManager",
        meta: { isAuth: true, key: "TeacherManager" },
        component: () => import("@/views/admin/info/TeacherManager.vue")
      },
      {
        path: "/CourseInfoManager",
        name: "CourseInfoManager",
        meta: { isAuth: true, key: "CourseInfoManager" },
        component: () => import("@/views/admin/info/course/CourseUpload.vue")
      },
      {
        path: "/ChapterManager",
        name: "ChapterManager",
        meta: { isAuth: true, key: "ChapterManager" },
        component: () => import("@/views/admin/info/course/ChapterManager.vue"),
      },
      {
        path: "/ClassTableManager",
        name: "ClassTableManager",
        meta: { isAuth: true, key: "ClassTableManager" },
        component: () => import("@/views/admin/info/course/ClassTableManager.vue")
      },
      {
        path: "/CourseResourceManager",
        name: "CourseResourceManager",
        meta: { isAuth: true, key: "CourseResourceManager" },
        component: () => import("@/views/admin/info/course/CourseResourceManager.vue")
      },
      {
        path: "/FileUpload",
        name: "FileUpload",
        meta: { isAuth: true, key: "FileUpload" },
        component: () => import("@/views/admin/FileUpload.vue")
      },
      {
        path: "/ApplyAuth",
        name: "ApplyAuth",
        meta: { isAuth: true, key: "ApplyAuth" },
        component: () => import("@/views/admin/ApplyAuth.vue")
      },
      {
        path: "/TeacherClassCourses",
        name: "TeacherClassCourses",
        meta: { isAuth: true, key: "TeacherClassCourses" },
        component: () => import("@/views/teacher/TeacherClassCourses.vue")
      },
      {
        path: "/InitSign",
        name: "InitSign",
        meta: { isAuth: true, key: "InitSign" },
        component: () => import("@/views/teacher/TeacherSignSend.vue")
      },
      {
        path: "/SignManager",
        name: "SignManager",
        meta: { isAuth: true, key: "SignManager" },
        component: () => import("@/views/SignManager.vue")
      },
      {
        path: "/SubjectUpload",
        name: "SubjectUpload",
        meta: { isAuth: true, key: "SubjectUpload" },
        component: () => import("@/views/subject/SubjectUpload.vue")
      },
      {
        path: "/SubjectPager",
        name: "SubjectPager",
        meta: { isAuth: true, key: "SubjectPager" },
        component: () => import("@/views/subject/SubjectPager.vue")
      },
      {
        path: "/SendAssignment",
        name: "SendAssignment",
        meta: { isAuth: true, key: "SendAssignment" },
        component: () => import("@/views/teacher/SendAssignment.vue")
      }
    ]
  },
  {
    path: "/*",
    name: "NotFound",
    component: () => import("@/components/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

//当前是管理员
router.addRoute("System", RootRouterPath["student.info"])


// 路由守卫
router.beforeEach(async (to, from, next) => {
  const currentRouterName = useRouter().currentRoute.value.fullPath.replaceAll(/[\/\\]*/g, "")
  const User = useUserStore();
  if (to.name === "Home") {
    if(User.getToken) {
      ElMessage.info("已经登录了");
      next("/System")
    } else next();
  } else {
    // 需要验证登录
    if (to.meta.isAuth) {
      //验证Token有效性
      if (User.getToken) {
        if(to.meta.key){
          if(User.getAuths.find( auth => auth.key === to.meta.key) || User.getUser.role.id === 1) next();
          else {
            ElMessage.error("没有访问权限");
            next(currentRouterName)
          }
        } else next();
      }
      else {
        ElMessage.error("请登录");
        next("/Home");
      }
    } else next();
  }
})

export default router
