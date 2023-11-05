import Axios, { AxiosResponse } from "axios";
import { baseURL } from "./env.http";
import { ElMessage } from "element-plus";
import { ServerData } from "./AxiosApis";
import Common from "./Modules/common";
import { useUserStore } from "@/store";
import router from "@/router";

// 路由白名单不需要认证
const RequestWhitePath = [
  "/api/common/sms",
  "/api/common/vsms",
];

const instance = Axios.create({
  baseURL: baseURL.Api.uri + ":" + baseURL.Api.port,
  timeout: 2000,
  headers: { "auth": "mjw" },
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const User = useUserStore();
  const find = RequestWhitePath.find(path => config.url === path);
  //需要认证的添加Token
  if (!find) config.headers.setAuthorization(User.getToken);
  return config;
}, error => ElMessage.error(error));

instance.interceptors.response.use((response: AxiosResponse<ServerData<any>>) => {
  const { data } = response;
  //服务端返回状态码
  if (data.code >= 400) {
    return Promise.reject(data);
  }
  return response;
}, (error) => {
  //服务端返回错误
  if (error?.response?.data) {
    const User = useUserStore();
    const code = error.response.status;
    //自定义数据结构
    const { message } = error?.response?.data;
    if (code === 410) {  //认证失效, 但是有数据返回
      console.log("正在刷新Token")
      Common.rToken().then(res => {
        User.setToken(res.data.data.token);
        console.log("刷新Token成功:[Authorization]:", res.data.data.token);
      }).catch(error => {
        ElMessage.error("登录失效" + error);
        // 清除用户信息
        User.clearInfo();   
        router.replace("/home") 
      });
      return Promise.resolve(error.response);
    } else if (code === 409) {
      ElMessage.error("用户信息无效，重新登录");
      User.clearInfo();
      router.replace("/home");
      return Promise.reject("用户信息无效，重新登录");
    } else {
      ElMessage.error(message)
      return Promise.reject(error);
    }
  }
  else {
    ElMessage.error("服务器错误" + JSON.stringify(error));
    return Promise.reject();
  }
});

export default function HttpRequest() {
  return instance;
}
