/**
 * 统一处理返回数据格式
 */

import { HttpStatus } from "@nestjs/common";

// 服务端统一返回格式
export type ServerData<T> = {
  data: T;
  message: string;
  code: number
}

export class HttpResponse<T> {

  public message: string;
  public code : HttpStatus;
  public data: T;

  constructor(code: HttpStatus, data : T) {
    this.code = code;
    this.data = data;
  }

  public send() : ServerData<T> {
    return {
      data: this.data, 
      message: this.message,
      code: this.code
    }
  }
}