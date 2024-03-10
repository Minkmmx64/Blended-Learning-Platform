import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ExamService } from "./exam.service";
import { ExamCreateDTO, ExamUpdateDTO, ExamQueryDTO } from "./exam.dto";
import { ExamCreateValid, ExamUpdateValid } from "./exam.valid";
import { StuExam } from "src/Entity/stu_exam.entity";
@Controller("exam")
export class ExamController {
  
  constructor(private readonly ExamService: ExamService){}

  // @Get("/list")
  // @UseInterceptors(new TokenExpireInterceptor())
  // public async ExamListsPagination(
  //   @Query() ExamQuery: PaginationQuery<ExamQueryDTO>
  // ) {
  //   const [ error, Exams ] = await this.ExamService.ExamListsPagination(ExamQuery);
  //   if(error) {
  //     throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
  //   } else return new HttpResponse<ListMetaData<StuExam[]>>(HttpStatus.ACCEPTED, Exams).send();
  // }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ExamCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ExamCreate(
    @Body() body: ExamCreateDTO
  ){
    const [error, InsertResult ] = await this.ExamService.ExamCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult[]>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  // @Put("/update")
  // @UseGuards(new AuthGuard())
  // @UsePipes(new ValidationPipe(ExamUpdateValid))
  // @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  // public async ExamUpdate(
  //   @Body() body: ExamUpdateDTO
  // ){
  //   const [ error, UpdateResult ] = await this.ExamService.ExamUpdate(body);
  //   if(error) {
  //     throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
  //   } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  // }

  // @Delete("/delete")
  // @UseGuards(new AuthGuard())
  // @UseInterceptors(new TokenExpireInterceptor())
  // public async ExamDelete(
  //   @Query("id") id: number,
  // ){
  //   const [ error, DeleteResult ] = await this.ExamService.ExamDelete(id);
  //   if(error) {
  //     throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
  //   } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  // }
}