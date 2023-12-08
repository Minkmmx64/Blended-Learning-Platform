import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Put, UseGuards, UseInterceptors, UsePipes, Query } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO , RootLoginDTO, RootInfoDTO, RootLoginUserInfo, RootQueryDTO } from "./root.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RootRegistSchema, RootLoginSchema, RootInfoSchema } from "./root.valid";
import { HttpResponse } from "src/response/response";
import { InsertResult } from "typeorm";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { AuthGuard } from "src/guard/auth.gurad";
import { RootUser } from "src/Entity/root_user.entity";
import { ListMetaData, PaginationQuery } from "../index.type";

@Controller("/root")
export class RootController {
  constructor(private readonly RootService: RootService){}

  @Post("/regist")
  @UsePipes(new ValidationPipe(RootRegistSchema))
  public async RootRegist(
    @Body() body: RootRegistDTO) {
      const [ error, insert ] = await this.RootService.RootRegist(body);
      if(error){
        throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error.message).send());
      } else return new HttpResponse<InsertResult>(HttpStatus.CREATED, insert).send();
    }

  @Post("/login")
  @UsePipes(new ValidationPipe(RootLoginSchema))
  public async RootLogin (
    @Body() body : RootLoginDTO
  ) {
    const [ error, user ] = await this.RootService.RootLogin(body);
    if(error){
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<RootLoginUserInfo>(HttpStatus.ACCEPTED, user).send();
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
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<RootUser>(HttpStatus.RESET_CONTENT, edit).send();
  }

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async RootListsPagination(
    @Query() Query: PaginationQuery<RootQueryDTO>
  ) {
    const [ error, roots ] = await this.RootService.RootListsPagination(Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<RootUser[]>>(HttpStatus.ACCEPTED, roots).send();
  }
}