import { BadRequestException, Body, Controller, HttpStatus, Post, Put, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO , RootLoginDTO, RootInfoDTO } from "./root.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RootRegistSchema, RootLoginSchema, RootInfoSchema } from "./root.valid";
import { HttpResponse } from "src/response/response";
import { InsertResult } from "typeorm";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { AuthGuard } from "src/guard/auth.gurad";

@Controller("/root")
export class RootController {
  constructor(private readonly RootService: RootService){}

  @Post("/regist")
  @UsePipes(new ValidationPipe(RootRegistSchema))
  public async RootRegist(
    @Body() body: RootRegistDTO) {
      const [ error, insert ] = await this.RootService.RootRegist(body);
      if(error){
        throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error).send());
      } else return new HttpResponse<InsertResult>(HttpStatus.CREATED, insert).send();
    }

  @Post("/login")
  @UsePipes(new ValidationPipe(RootLoginSchema))
  public async RootLogin (
    @Body() body : RootLoginDTO
  ) {
    const [ error, user ] = await this.RootService.RootLogin(body);
    if(error){
      throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.ACCEPTED, user).send();
  }

  @Put("/info")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(RootInfoSchema))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async RootUpdateInfo(
    @Body() body: RootInfoDTO
  ) {
    const [ error, edit ] = await this.RootService.RootUpdateInfo(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error).send());
    } else return new HttpResponse<any>(HttpStatus.RESET_CONTENT, edit).send();
  }
}