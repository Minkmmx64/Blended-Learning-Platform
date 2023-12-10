import { ISystemMenus } from "./AdminSystemLayout.type";

const config = {
  MenuBackColor: "rgb(48,65,86)",
  width: 200,
  default_menu: 'Wellcome', //管理首页
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
    route: "Wellcome",
    key: "Wellcome",
    icon: "setting-filling"
  },
  {
    name: "信息管理",
    key: "BaseManager",
    icon: "configue",
    subMenu : [
      {
        name: "学生管理",
        key: "StudentManager",
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
        name: "课程管理",
        key: "CourseManager",
        icon: "port-array-full",
        subMenu: [
          {
            name: "课程上传",
            key: "CourseUpload",
            route: "CourseUpload",
            icon: "top"
          },
          {
            name: "章节管理",
            key: "ChapterManager",
            route: "ChapterManager",
            icon: "add-behavor-port"
          }
        ]
      },
      {
        name: "教师管理",
        key: "TeacherManager",
        icon: "add_file",
        route: "TeacherManager"
      },
      {
        name: "学院管理",
        route: "CollegeManager",
        key: "CollegeManager",
        icon: "survey"
      },
      {
        name: "班级管理",
        route: "ClassManager",
        key: "ClassManager",
        icon: "intermediate-filling"
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
      },
      {
        name: "系统用户列表",
        key: "AuthSystemUser",
        route: "AuthSystemUser",
        icon: "lock"
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
];

export { SystemMenus , config }