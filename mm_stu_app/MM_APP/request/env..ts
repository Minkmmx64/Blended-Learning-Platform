import { Alert } from "react-native";
import { Toast } from '../compoment/display/toast/Toast';
export const BaseUrl = "http://app.minkm.api:8080/api";

export interface RequestData<U = any> {
  code: number;
  data: U;
  message: string;
}

export class Request {

  private prefix: string = "";

  protected time = 5000;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  protected WithTimeOut(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("request time out"));
      }, time);
    })
  }

  protected Fetch(Method: "GET" | "POST", url: string, params?: Record<string, any>, TimeOut: number = this.time): Promise<Response> {
    return new Promise((resolve, reject) => {
      const singalController = new AbortController();
      let config = {
        method: Method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        signal: singalController.signal
      };
      let uri = BaseUrl + this.prefix + url;
      if(Method === "POST") {
        config = Object.assign(config, { body: JSON.stringify(params) });
      } else {
        //get 合并参数
        if(params) {
          const query = Object.keys(params).map( key => `${key}=${params[key]}`).join("&")
          uri = `${uri}?${query}`;
        }
      }
      fetch( uri , config).then(res => {
        resolve(res);
      }).catch(error => {
        reject(new Error(error));
      });
      setTimeout(() => {
        reject(new Error('fetch timout'));
        //取消请求
        singalController.abort();
      }, TimeOut);
    })
  }

  protected async get(url: string, params?: Record<string, any>, TimeOut: number = this.time) {
    return this.tran(this.Fetch("GET", url, params, TimeOut))
  }

  protected async post(url: string, body?: Record<string, any>, TimeOut: number = this.time) {
    return this.tran(this.Fetch("POST", url, body, TimeOut))
  }

  protected async tran(data: Promise<Response>): Promise<RequestData> {
    try {
      const res = await data;
      if (res.ok) {
        const successMsg = await res.json();
        //ToastAndroid.show(`"请求成功:: => [", ${JSON.stringify(successMsg)}, "] <="`, 1000);
        //Toast.show("网络请求" , JSON.stringify(successMsg));
        return successMsg;
      }
      else {
        const errMsg = await res.json();
        return Promise.reject(errMsg);
      }
    } catch (err) {
      const error = err as any;
      let err_msg = "";
      if(error.toString) err_msg = error.toString();
      else err_msg = JSON.stringify(error);
      Toast.show("请求错误" , err_msg);
      console.error(err_msg);
      return Promise.reject(error);
    }
  }
}

