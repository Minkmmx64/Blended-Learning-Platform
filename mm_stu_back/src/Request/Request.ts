import Axios, { AxiosInterceptorManager, AxiosResponse } from "axios";
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
  console.log(config);
  return config;
}, error => ElMessage.error(error));

instance.interceptors.response.use( (response :  AxiosResponse<ServerData<any>>) => {
  const { data } = response;
  if(data.code >= 400){
    ElMessage.error(data.message);
    return Promise.reject(data);
  }
  return response;
}, error => ElMessage.error(error));

export default function HttpRequest() {
  return instance;
}
