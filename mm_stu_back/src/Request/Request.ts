import Axios, { AxiosResponse } from "axios";
import { baseURL } from "./env.http";
import { ElMessage } from "element-plus";
import { ServerData } from "./AxiosApis";
import Common from "./Modules/common";
import { useUserStore } from "@/store";

// 路由白名单不需要认证
const RequestWhitePath = [
  "/api/common/sms",
  "/api/common/vsms",
];


const instance = Axios.create({
  baseURL: baseURL.Api.uri + ":" + baseURL.Api.port,
  timeout: 2000,
  headers: { "auth" : "mjw" },
  withCredentials: true,
});

instance.interceptors.request.use( config => {
  const User = useUserStore();
  const find = RequestWhitePath.find( path => config.url === path);
  //需要认证的添加Token
  if(!find) config.headers.setAuthorization(User.getToken);
  return config;
}, error => ElMessage.error(error));

instance.interceptors.response.use( (response :  AxiosResponse<ServerData<any>>) => {
  const { data } = response;
  //服务端返回状态码
  if(data.code >= 400){
    return Promise.reject(data);
  }
  return response;
},(error) => {
  //服务端返回错误
  if(error?.response?.data) {
    //自定义数据结构
    const { message, code } = error?.response?.data;
    if(code === 409) {  //认证失效
      ElMessage.success("正在刷新Token")
      const User = useUserStore();
      Common.rToken().then( res => {
        setTimeout(() => {
          ElMessage.success("刷新Token成功")
          User.setToken(res.data.data.token);
        }, 500);
      }).catch( error => {
        ElMessage.error("刷新Token失败" + error);
        // 清除用户信息
        User.clearInfo();
        return Promise.resolve();
      })
    } else {
      ElMessage.error(message)
      return Promise.reject(error);
    }
  }
  else {
    ElMessage.error("服务器错误" + JSON.stringify(error));
    return Promise.reject();
  }
  return Promise.resolve();
});

export default function HttpRequest() {
  return instance;
}
