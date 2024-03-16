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
    key: "InfoManager",
    icon: "configue",
    subMenu : [
      {
        name: "学生管理",
        key: "StudentManager",
        icon: "user-filling",
        subMenu: [
          {
            name: "学籍管理",
            route: "StudenInfotManager",
            key: "StudenInfotManager",
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
            key: "CourseInfoManager",
            route: "CourseInfoManager",
            icon: "top"
          },
          {
            name: "章节管理",
            key: "ChapterManager",
            route: "ChapterManager",
            icon: "add-behavor-port"
          },
          {
            name: "课表管理",
            key: "ClassTableManager",
            route: "ClassTableManager",
            icon: "docunment"
          },
          {
            name: "资源管理",
            key: "CourseResourceManager",
            route: "CourseResourceManager",
            icon: "decline-filling"
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
    key: "AuthorizationManager",
    icon: "port-dictionary-full",
    subMenu: [
      {
        name: "菜单列表",
        key: "AuthorizationMenuManager",
        icon: "port-dictionary-left",
        route: "AuthorizationMenuManager"
      },
      {
        name: "角色列表",
        key: "AuthorizationRoleManager",
        route: "AuthorizationRoleManager",
        icon: "users"
      },
      {
        name: "系统用户列表",
        key: "SystemUserManager",
        route: "SystemUserManager",
        icon: "lock"
      }
    ]
  },
  {
    name: "我的课程",
    key: "TeacherClassCourses",
    icon: "film",
    route: "TeacherClassCourses"
  },
  {
    name: "上课管理",
    key: "AttendClassManager",
    icon: "task",
    subMenu: [
      {
        name: "发起签到",
        key: "InitSign",
        icon: "scanning",
        route: "InitSign"
      },
      {
        name: "签到管理",
        key: "SignManager",
        icon: "shou",
        route: "SignManager"
      }
    ]
  },
  {
    name: "题库",
    key: "SubjectManager",
    icon: "TencentCloud",
    subMenu: [
      {
        name: "题库上传",
        key: "SubjectUpload",
        icon: "history",
        route: "SubjectUpload"
      },
      {
        name: "生成试卷",
        key: "SubjectPager",
        icon: "file-add",
        route: "SubjectPager"
      }
    ]
  },
  {
    name: "个人管理",
    key: "AdminManager",
    icon: "GitHub",
    subMenu: [
      {
        name: "个人信息",
        key: "AdminInfoManager",
        route: "AdminInfoManager",
        icon: "twitter"
      }
    ]
  },
  {
    name: "文件上传",
    key: "FileUpload",
    icon: "arrow-up-circle",
    route: "FileUpload"
  },
  {
    name: "权限申请",
    key: "ApplyAuth",
    icon: "ssun",
    route: "ApplyAuth"
  },
  {
    name: "作业管理",
    key: "AssignmentManager",
    icon: "attachment",
    subMenu: [
      {
        name: "发布作业",
        route: "SendAssignment",
        key: "SendAssignment",
        icon: "caps-lock"
      },
      {
        name: "作业列表",
        route: "AssignmentList",
        key: "AssignmentList",
        icon: "edit"
      }
    ],
  }
];

export { SystemMenus , config }