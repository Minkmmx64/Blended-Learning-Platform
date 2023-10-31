import { Controller, Get, Session, Res, Post, Body, Req, HttpStatus, UsePipes } from "@nestjs/common";
import { CommonService } from "./common.service";
import { Request, Response } from "express";
import { HttpResponse } from "src/response/response";
import { ValidationPipe } from "src/utils/pipes";
import { CommonValid } from "./common.valid";
import { SmsDTO } from "./common.dto";

@Controller("/common")
export class CommonController {

  constructor(private readonly CommonService: CommonService) { }

  @Get("/sms")
  public getSmsCode(@Session() session: Record<string, any>) {
    const code = this.CommonService.getSmsCode(session);
    return new HttpResponse<string>(HttpStatus.NO_CONTENT, code).send();
  }

  @Post("/sms")
  @UsePipes(new ValidationPipe(CommonValid))
  public vSmsCode(
    @Body() body: SmsDTO,
    @Session() session: Record<string, any>
  ) {
    // 验证验证码正确
    const verify = this.CommonService.vSmsCode(body.code, session);
    if(verify) {
      return new HttpResponse<null>(HttpStatus.NO_CONTENT).send();
    } else {
      return new HttpResponse<null>(HttpStatus.FORBIDDEN).send();
    }
  }
}