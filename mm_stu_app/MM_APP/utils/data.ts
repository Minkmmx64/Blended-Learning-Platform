import { IUtilTools } from "../screen/Tab/tab.type"
import { UtilToolsBaseProps } from "../screen/compoment/UtilTools";

export const CourseDatas = [
  {
    "id": 1,
    "create_time": "2024-01-15T11:01:37.287Z",
    "update_time": "2024-01-18T03:19:43.000Z",
    "status": true,
    "remark": "数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。数据结构与算法是计算机科学的两个核心概念，它们密切相关且在软件开发和计算机理论中扮演着关键角色。",
    "name": "数据结构与算法",
    "avatar": "http://app.minkm.api:8080/image/cb24d172a77878a4b736b7b7dd905de7.png",
    "college": {
      "id": 1,
      "create_time": "2024-01-15T10:36:41.223Z",
      "update_time": "2024-01-15T10:36:41.223Z",
      "status": true,
      "remark": "信息工程学院",
      "name": "信息工程学院",
      "code": "xg"
    }
  }
]

export const UtilToolDatas: IUtilTools[] = [
  {
    icon: "http://124.220.176.205:8080/image/5a20e6b155ca8a6d329435818b4b223b.png",
    nav: { type: "tab", url: "CourseScreen" },
    label: "我的课程"
  },
  {
    icon: "http://124.220.176.205:8080/image/6111ea5a4a5fa3f722113db6256b11c5.png",
    nav: { type: "tab", url: "CourseScreen" },
    label: "我的消息"
  },
  {
    icon: "http://124.220.176.205:8080/image/f74854b094f95217a6f3f3f98ead7fd8.png",
    nav: { type: "stack", url: "SignScreen" },
    label: "我的签到"
  },
  {
    icon: "http://124.220.176.205:8080/image/dce39efbddf779b0a7de40b8677ce865.png",
    nav: { type: "tab", url: "CourseScreen" },
    label: "我的课表"
  },
  {
    icon: "http://124.220.176.205:8080/image/fc946b24eed172e37b2fe67664f57431.png",
    nav: { type: "tab", url: "CourseScreen" },
    label: "我的群聊"
  }
];

interface IAdminUtilToolsDatas extends UtilToolsBaseProps {

}

export const AdminUtilToolsDatas: IAdminUtilToolsDatas[] = [
  {
    icon: "http://124.220.176.205:8080/image/8982524538364bdf87d23d2475420513.png",
    label: "个人资料(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/4c15206b06c26751cd152546a478bf4a.png",
    label: "通用设置(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/0bb2f1f8e1941e3b9d621d18099cff37.png",
    label: "帮助与支持(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/349b8ffadcb311e7eebe0f53ed37a7f1.png",
    label: "我的成绩(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/031677af39b4b17d5e8072c63ab2def5.png",
    label: "收藏(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/cf0a35986876dedd2ee008a4d3f129a5.png",
    label: "通知中心(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/58d4e4fd6a68d698bdb7f9d57b3efa0b.png",
    label: "设置与隐私(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/ff39133894d8e1fad9c1a1b5e336ab2a.png",
    label: "用户功能2(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/ff39133894d8e1fad9c1a1b5e336ab2a.png",
    label: "用户功能3(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/ff39133894d8e1fad9c1a1b5e336ab2a.png",
    label: "用户功能4(开发中)"
  },
  {
    icon: "http://124.220.176.205:8080/image/ff39133894d8e1fad9c1a1b5e336ab2a.png",
    label: "用户功能5(开发中)"
  }
]

export const userlogin = {
  "avatar": null, 
  "create_time": 
  "2024-01-28T09:16:37.126Z", 
  "id": 9, 
  "label": null, 
  "password": 
  "fc4943221010a110ef7b5b7258eaa4a9", 
  "phone": "13989649042", 
  "remark": null, 
  "status": true, 
  "student": {
    "age": 22, 
    "avatar": "http://app.minkm.api:8080/image/dea4219b2ff384bcfc7fae18b6460b4e.jpeg", 
    "class": { 
      "code": "jk1", 
      "create_time": "2024-01-19T02:21:59.627Z", 
      "id": 9, 
      "name": "计算机科学与技术1班", 
      "remark": "计算机科学与技术1班", 
      "status": true, 
      "update_time": "2024-01-19T02:21:59.627Z" 
    }, 
    "create_time": "2024-01-19T02:29:19.433Z", 
    "gender": "男", 
    "id": 3,
    "name": "陈华", 
    "native": "浙江省,台州市", 
    "remark": null, 
    "school": "浙江理工大学科技与艺术学院", 
    "status":true, 
    "student": "24xgjk1002", 
    "update_time": "2024-01-19T02:33:02.000Z", 
    "year": 2024,
  }, 
  "type": "student", 
  "update_time": "2024-01-28T09:16:37.126Z", 
  "username": "ch123"
}