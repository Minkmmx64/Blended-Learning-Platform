import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { CourseService } from "./course.service";
import { CourseCreateDTO, CourseUpdateDTO, CourseQueryDTO } from "./course.dto";
import { CourseCreateValid, CourseUpdateValid } from "./course.valid";
import { StuCourse } from "src/Entity/stu_course.entity";
@Controller("course")
export class CourseController {
  
  constructor(private readonly CourseService: CourseService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async CourseListsPagination(
    @Query() CourseQuery: PaginationQuery<CourseQueryDTO>
  ) {
    const [ error, Courses ] = await this.CourseService.CourseListsPagination(CourseQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuCourse[]>>(HttpStatus.ACCEPTED, Courses).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(CourseCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async CourseCreate(
    @Body() body: CourseCreateDTO
  ){
    const [error, InsertResult ] = await this.CourseService.CourseCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(CourseUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async CourseUpdate(
    @Body() body: CourseUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.CourseService.CourseUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async CourseDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.CourseService.CourseDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}