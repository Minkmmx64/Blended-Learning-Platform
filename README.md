#### 介绍
学生可以在App端注册，教师发送在线签到，发布作业，并使用websocket 和 JPush 完成的一个简单的crud毕业设计项目，后台管理使用RBAC权限控制划分分配角色。
其中App端封装了一些实用组件：瀑布流，手势绘制。
服务端使用redis实现大文件分片上传，断点续传，秒传
客户端使用WebWorker + spark-md5 实现文件存储的唯一性
本项目还有许多可以完善的，但是用于毕业应该够了。。。

#### 软件架构

本项目分为一个基于Nodejs的Nestjs框架的服务端
一个Vue3后台管理系统
一个RN的App端(仅能运行在Android端)

1、后台管理系统技术栈
Vue3 + pinia + composition Api + TypeScript + WebSocket + element-plus + Axios
2、后端服务
nodejs + nestjs + typeorm + mysql + redis + joi + jpush-async
3、app端
react native >= 0.73.0 + react 18 + react-navigation/native-stack + JPush + redux
#### 安装教程
#   web 管理系统
1.  cd mm_stu_back (建议使用 node v14.18.3 安装依赖)
2.  npm install
3.  npm run serve 或者 直接 运行 run.bat

#   服务端
1. cd mm_stu_serve (建议使用 node v20+)
2. npm install
3. npm run start 或者 直接 运行 run.bat

#   App端
1. cd mm_stu_app
2. npm install
3. npm run start

#### 使用说明

1. 需要在 mm_stu_serve 新建一个 .env 文件
![env-example](./env-example.png)

#### 项目展示
1、管理系统 配置菜单
![alt text](image.png)
2、分配角色
![alt text](image-1.png)
3、上传文件 支持断点续传，秒传
![alt text](image-2.png)
![alt text](image-3.png)
4、教师用户登录
![alt text](image-4.png)
5、教师发布签到
![alt text](image-5.png)
设置手势签到
![alt text](image-6.png)
![alt text](image-7.png)
6、教师发布作业 题库由管理员上传
![alt text](image-8.png)
7、app端登录
<img src='27b5371d5d03b60c1bc11fa3a049df1.jpg' width=300 />
主页面
<img src='953827007288071932ee7cef8e8a0e9.jpg' width=300 />
收到签到通知
<img src='267e850bc763d44b12b4b1a703dba4b.jpg' width=300 />
进行签到
![alt text](example.gif)
在线测验
![alt text](example-2.gif)


