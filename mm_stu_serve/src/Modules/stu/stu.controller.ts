import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { StuService } from "./stu.service";
import { StuCreateDTO, StuQueryDTO, StuUpdateDTO } from "./stu.dto";
import { StuCreateValid, StuUpdateValid } from "./stu.valid";
import { StuInfo } from "src/Entity/stu_info.entity";
@Controller("stu")
export class StuController {
  
  constructor(private readonly StuService: StuService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async StuListsPagination(
    @Query() StuQuery: PaginationQuery<StuQueryDTO>
  ) {
    const [ error, Stus ] = await this.StuService.StuListsPagination(StuQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuInfo[]>>(HttpStatus.ACCEPTED, Stus).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(StuCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async StuCreate(
    @Body() body: StuCreateDTO
  ){
    const [error, InsertResult ] = await this.StuService.StuCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(StuUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async StuUpdate(
    @Body() body: StuUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.StuService.StuUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async StuDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.StuService.StuDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}