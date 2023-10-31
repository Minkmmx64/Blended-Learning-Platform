import Axios, { AxiosError, AxiosResponse } from "axios";
import { baseURL } from "./env.http";
import { ElMessage } from "element-plus";
import { ServerData } from "./AxiosApis";

const instance = Axios.create({
  baseURL: baseURL.Api.uri + ":" + baseURL.Api.port,
  timeout: 2000,
  headers: {
    "auth" : "mjw"
  },
  withCredentials: true,
});

instance.interceptors.request.use( config => {
  return config;
}, error => ElMessage.error(error));

instance.interceptors.response.use( (response :  AxiosResponse<ServerData<any>>) => {
  const { data } = response;
  if(data.code >= 400){
    return Promise.reject(data);
  }
  return response;
}, (error) => {
  if(error.response.data.message)
    ElMessage.error(error.response.data.message)
  else ElMessage.error("服务器错误" + JSON.stringify(error));
  return Promise.resolve();
});

export default function HttpRequest() {
  return instance;
}
