
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { TeacherService } from "./teacher.service";
import { TeacherCreateDTO, TeacherUpdateDTO, TeacherQueryDTO } from "./teacher.dto";
import { TeacherCreateValid, TeacherUpdateValid } from "./teacher.valid";
import { StuTeacher } from "src/Entity/stu_teacer.entity";
@Controller("teacher")
export class TeacherController {
  
  constructor(private readonly TeacherService: TeacherService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async TeacherListsPagination(
    @Query() TeacherQuery: PaginationQuery<TeacherQueryDTO>
  ) {
    const [ error, Teachers ] = await this.TeacherService.TeacherListsPagination(TeacherQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuTeacher[]>>(HttpStatus.ACCEPTED, Teachers).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(TeacherCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async TeacherCreate(
    @Body() body: TeacherCreateDTO
  ){
    const [error, InsertResult ] = await this.TeacherService.TeacherCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(TeacherUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async TeacherUpdate(
    @Body() body: TeacherUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.TeacherService.TeacherUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async TeacherDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.TeacherService.TeacherDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}