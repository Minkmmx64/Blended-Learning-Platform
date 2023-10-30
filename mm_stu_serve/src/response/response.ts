/**
 * 统一处理返回数据格式
 */

import { HttpStatus } from "@nestjs/common";

export const HttpMessage = {
  [HttpStatus.NO_CONTENT] : "success, No data",
  [HttpStatus.FORBIDDEN] : "refuse, Authentication failed",
  [HttpStatus.BAD_REQUEST] : "Bad Request"
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

  constructor(code: HttpStatus, data? : T) {
    this.code = code;
    this.data = data;
  }

  public send() : ServerData<T> {
    return {
      data: this.data, 
      message: HttpMessage[this.code] ?? "unknow status code",
      code: this.code
    }
  }
}