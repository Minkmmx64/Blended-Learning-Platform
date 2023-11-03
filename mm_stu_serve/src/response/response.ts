/**
 * 统一处理返回数据格式
 */

import { HttpStatus } from "@nestjs/common";

export const HttpMessage = {
  [HttpStatus.NO_CONTENT] : "success, No data",             //无返回值请求成功
  [HttpStatus.FORBIDDEN] : "refuse, Authentication failed", //用户无认证
  [HttpStatus.BAD_REQUEST] : "Bad Request",                 //请求错误
  [HttpStatus.CREATED] : "createdd success",                //创建资源成功
  [HttpStatus.ACCEPTED] : "accept",                         //有返回值请求成功
  [HttpStatus.UNAUTHORIZED] : "Authorized failed",          //用户认证失败
  [HttpStatus.CONFLICT] : "Authorized relogin",             //重新登录
  [HttpStatus.GONE] : "Authorized expired"                  //用户认证过时      
}

// 服务端统一返回格式
export type ServerData<T> = {
  data: T;
  message: string;
  code: number
}

export class HttpResponse<T> {

  public code : HttpStatus;
  public data: T;
  public message: string;

  constructor(code: HttpStatus, data? : T, message ?: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  public send() : ServerData<T> {
    return {
      data: this.data, 
      message: this.message ?? HttpMessage[this.code] ?? "unknow status code",
      code: this.code
    }
  }
}