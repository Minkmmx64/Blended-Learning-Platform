import { Controller, Get, Session, Res, Post, Body, Req, HttpStatus } from "@nestjs/common";
import { CommonService } from "./common.service";
import { Request, Response } from "express";
import { HttpResponse } from "src/response/response";

@Controller("/common")
export class CommonController {

  constructor(private readonly CommonService: CommonService) { }

  @Get("/sms")
  public getSmsCode(@Session() session: Record<string, any>) {
    const code = this.CommonService.getSmsCode(session);
    return new HttpResponse<string>(HttpStatus.NO_CONTENT, code).send();
  }

  @Post("/sms")
  public vSmsCode(
    @Body("code") code: string,
    @Session() session: Record<string, any>
  ) {
    // 验证验证码正确
    const verify = this.CommonService.vSmsCode(code, session);
    if(verify) {
      return new HttpResponse<null>(HttpStatus.NO_CONTENT).send();
    } else {
      return new HttpResponse<null>(HttpStatus.FORBIDDEN).send();
    }
  }
}