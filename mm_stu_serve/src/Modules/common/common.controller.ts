import { Controller, Get, Session, Post, Body, HttpStatus, UsePipes, BadRequestException, UseGuards, GoneException, Headers, ConflictException, UseInterceptors } from "@nestjs/common";
import { CommonService } from "./common.service";
import { HttpResponse } from "src/response/response";
import { ValidationPipe } from "src/utils/pipes";
import { CommonSmsValid, CommonTokenValid } from "./common.valid";
import { SmsDTO, vTokenDTO } from "./common.dto";
import { JwtPayload } from "jsonwebtoken";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";

@Controller("/common")
export class CommonController {

  constructor(private readonly CommonService: CommonService) { }

  @Get("/sms")
  public getSmsCode(@Session() session: Record<string, any>) {
    const code = this.CommonService.getSmsCode(session);
    return new HttpResponse<string>(HttpStatus.NO_CONTENT, code).send();
  }

  @Post("/sms")
  @UsePipes(new ValidationPipe(CommonSmsValid))
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

  @Post("/vtoken")
  @UsePipes(new ValidationPipe(CommonTokenValid))
  public vToken(
    @Body() body: vTokenDTO
  ) {
    const [ error, ok ] = this.CommonService.vToken(body.token);
    if(error) {
      //token超过失效
      if(error === "TokenExpiredError: jwt expired") {
        throw new GoneException(new HttpResponse<any>(HttpStatus.GONE, null,  error).send());
      } else {
        throw new ConflictException(new HttpResponse<string | JwtPayload>(HttpStatus.CONFLICT, null, error.toString() ).send());
      }
    } else {
      return new HttpResponse<string | JwtPayload>(HttpStatus.ACCEPTED, "ok").send();
    }
  }

  @Get("/rtoken")
  public rToken(
    @Headers("Authorization") Authorization: string
  ) {
    const [ error, Token ] = this.CommonService.rToken(Authorization);
    if(error){
      throw new ConflictException(new HttpResponse<any>(HttpStatus.CONFLICT, null,  error).send());
    }
    return  new HttpResponse<{ token : string }>(HttpStatus.ACCEPTED, {
      token: Token
    }).send();
  }

  @Get("/test")
  @UseInterceptors(new TokenExpireInterceptor())
  public test(){
    return new HttpResponse<string>(HttpStatus.ACCEPTED, "ok").send();
  }
}