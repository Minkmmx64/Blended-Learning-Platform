import { Controller, Get, Session, Res, Post, Body, Req, HttpStatus, UsePipes, BadRequestException, ConflictException, UseGuards } from "@nestjs/common";
import { CommonService } from "./common.service";
import { HttpResponse } from "src/response/response";
import { ValidationPipe } from "src/utils/pipes";
import { CommonSmsValid, CommonTokenValid } from "./common.valid";
import { SmsDTO, vTokenDTO } from "./common.dto";
import { JwtPayload } from "jsonwebtoken";
import { AuthGuard } from "src/guard/auth.guard";

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
      if(error === "TokenExpiredError: jwt expired") {
        throw new ConflictException(new HttpResponse<any>(HttpStatus.CONFLICT, null,  error).send());
      } else {
        throw new BadRequestException(new HttpResponse<string | JwtPayload>(HttpStatus.BAD_REQUEST, null, error.toString() ).send());
      }
    } else {
      return new HttpResponse<string | JwtPayload>(HttpStatus.ACCEPTED, "ok").send();
    }
  }

  @Get("/rtoken")
  @UseGuards(AuthGuard)
  public rToken() {
    const Token = this.CommonService.rToken();
    return  new HttpResponse<{ token : string }>(HttpStatus.ACCEPTED, {
      token: Token
    }).send();
  }
}