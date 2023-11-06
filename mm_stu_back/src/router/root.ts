import { RouteRecordRaw } from 'vue-router'

// 管理员路由
export const RootRouterPath  = {
  //学籍管理
  ["student.info"] : {  
    name: "StudentInfo",
    path: "/StudentInfo",
    component: () => import("@/views/test/AnimTest.vue"),
    meta: { isAuth: true }
  } as RouteRecordRaw
}