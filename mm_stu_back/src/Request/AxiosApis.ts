import { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpRequest from "./Request";

// 服务端统一返回格式
export type ServerData<T> = {
  data: T;
  message: string;
  code: number
}

// 服务端返回的数据data
export class AxiosApi<T> {
  public prefix?: string;
  constructor(pre: string){
    this.prefix = pre;
  }

  public get(url: string, params?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    config = config ?? {};
    return HttpRequest().get(this.prefix + url, Object.assign(config, { params : params }));
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    return HttpRequest().post(this.prefix + url, data, config);
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    return HttpRequest().put(this.prefix + url, data, config);
  }

  public delete(url: string, params?: any, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    config = config ?? {};
    return HttpRequest().delete(this.prefix + url, Object.assign(config, { params : params }));
  }
}