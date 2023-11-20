import { ISystemMenus } from "./AdminSystemLayout.type";

const config = {
  MenuBackColor: "rgb(48,65,86)",
  width: 200,
  default_menu: 'Admin', //管理首页
}

/**
 * @author Minkmm
 * @description 这里填写你的管理系统菜单路由
 * 参数 route & key 请保持一致 !!!!!!!!!!!!!!!!!!!!!!
 * 支持子菜单无限递归 !
 * icon 使用 IconFont !!! 填写图标名称
 */
const SystemMenus: ISystemMenus[] = [
  {
    name: "管理首页",
    route: "Admin",
    key: "Admin",
    icon: "setting-filling"
  },
  {
    name: "学生管理",
    key: "Student",
    icon: "user-filling",
    subMenu: [
      {
        name: "学籍管理",
        route: "StudentInfo",
        key: "StudentInfo",
        icon: "file-common"
      }
    ]
  },
  {
    name: "个人管理",
    key: "Personal",
    icon: "GitHub",
    subMenu: [
      {
        name: "个人信息",
        key: "PersonalInfo",
        route: "PersonalInfo",
        icon: "image-text"
      }
    ]
  },
  {
    name: "权限系统",
    key: "Authorization",
    icon: "port-dictionary-full",
    subMenu: [
      {
        name: "菜单列表",
        key: "AuthorizationMenu",
        icon: "port-dictionary-left",
        route: "AuthorizationMenu"
      },
      {
        name: "角色列表",
        key: "AuthorizationRole",
        route: "AuthorizationRole",
        icon: "users"
      }
    ]
  }
];

export { SystemMenus , config }