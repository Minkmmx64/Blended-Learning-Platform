import { Controller, Get, Session, Res, Post, Body, Req } from "@nestjs/common";
import { CommonService } from "./common.service";
import { Request, Response } from "express";

@Controller("/common")
export class CommonController {

  constructor(private readonly CommonService: CommonService) { }

  @Get("/sms")
  public getSmsCode(@Session() session: Record<string, any>) {
    return this.CommonService.getSmsCode(session);
  }

  @Post("/sms")
  public vSmsCode(
    @Body("code") code: string,
    @Session() session: Record<string, any>
  ) {
    // 验证验证码正确
    const verify = this.CommonService.vSmsCode(code, session);
    
  }
}