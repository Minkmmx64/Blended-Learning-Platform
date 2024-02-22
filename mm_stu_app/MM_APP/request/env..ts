import { Toast } from '../compoment/display/toast/Toast';

const dev = false;
const url = dev ? "app.minkm.api:8080" : "192.168.0.105:8080";
export const BaseUrl = `http://${url}/api`;

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
        this.dataTransform(successMsg);
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

  
  //递归解析对象
  protected dataTransform(data: any | any[]) {
    // 添加补丁，修改匹配字符串的值
    for(const o in data) {
      const type = Object.prototype.toString.call(data[o]);
      if(type === "[object String]") {
        data[o] = (data[o] as string).replaceAll("app.minkm.api:8080", s => url);
      }else if(type === "[object Array]") {
        for(let i = 0 ; i < (data[o] as []).length; i ++) {
          const type2 = Object.prototype.toString.call(data[o][i]);
          if(type2 === "[object String]") data[o][i] = (data[o][i] as string).replaceAll("app.minkm.api:8080", s => url);
          else if(type2 === "[object Object]" || type2 === "[object Array]") this.dataTransform(data[o][i]);
        }
      }else if(type === "[object Object]") {
        this.dataTransform(data[o]);
      }
    }
  }
}

