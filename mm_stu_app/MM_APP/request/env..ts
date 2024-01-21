import { Alert } from "react-native";

export const BaseUrl = "http://app.minkmm.api:8080/api";


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

  protected Fetch(Method: "GET" | "POST", url: string, params?: unknown, TimeOut: number = this.time): Promise<Response> {
    return new Promise((resolve, reject) => {
      const singalController = new AbortController()
      fetch(BaseUrl + this.prefix + url, {
        method: Method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
        signal: singalController.signal
      }).then(res => {
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

  protected async get(url: string, params?: unknown, TimeOut: number = this.time) {
    return this.tran(this.Fetch("GET", url, params, TimeOut))
  }

  protected async post(url: string, body?: unknown, TimeOut: number = this.time) {
    return this.tran(this.Fetch("POST", url, body, TimeOut))
  }

  protected async tran(data: Promise<Response>) {
    try {
      const res = await data;
      if (res.ok) {
        const successMsg = await res.json();
        console.debug("请求成功:: => [", successMsg, "] <=");
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
      Alert.alert("请求错误", err_msg);
      return Promise.reject(error);
    }
  }
}

