import { ISystemMenus } from "./AdminSystemLayout.type";

const config = {
  MenuBackColor: "rgb(48,65,86)",
  width: 200,
  default_menu: 'admin', //管理首页
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
    name: "admin",
    route: "admin",
    key: "admin",
    icon: "port-set"
  },
  {
    name: "TestGroup",
    key: "TestGroup",
    icon: "port-set",
    subMenu: [
      {
        name: "AnimTest",
        route: "AnimTest",
        key: "AnimTest",
        icon: "port-set"
      }
    ]
  }
];

export { SystemMenus , config }