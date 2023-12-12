import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Put, UseGuards, UseInterceptors, UsePipes, Query } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO , RootLoginDTO, RootInfoDTO, RootLoginUserInfo, RootQueryDTO, RootUpdateDTO } from "./root.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RootRegistSchema, RootLoginSchema, RootInfoSchema, RootUpdateValid } from "./root.valid";
import { HttpResponse } from "src/response/response";
import { InsertResult, UpdateResult } from "typeorm";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { AuthGuard } from "src/guard/auth.gurad";
import { RootUser } from "src/Entity/root_user.entity";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { RootRouters } from "src/Entity/root_routers.entity";

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

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(RootUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async RootUserRoleUpdate(
    @Body() Body : RootUpdateDTO
  ) {
    const [ error, UpdateResult ] = await this.RootService.RootUserRoleUpdate(Body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Get("/auth")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async AuthMenuList(
    @Query("id") id: number
  ) {
    const [ error, auths ] = await this.RootService.AuthMenuList(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<RootRouters[]>(HttpStatus.RESET_CONTENT, auths ).send();
  }
}