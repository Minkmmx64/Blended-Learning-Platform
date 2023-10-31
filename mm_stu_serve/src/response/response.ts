/**
 * 统一处理返回数据格式
 */

import { HttpStatus } from "@nestjs/common";

export const HttpMessage = {
  [HttpStatus.NO_CONTENT] : "success, No data",
  [HttpStatus.FORBIDDEN] : "refuse, Authentication failed",
  [HttpStatus.BAD_REQUEST] : "Bad Request",
  [HttpStatus.CREATED] : "createdd success",
  [HttpStatus.ACCEPTED] : "accept"
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