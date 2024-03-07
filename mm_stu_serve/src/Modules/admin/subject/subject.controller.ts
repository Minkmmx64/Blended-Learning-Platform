import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { SubjectService } from "./subject.service";
import { SubjectCreateDTO, SubjectUpdateDTO, SubjectQueryDTO } from "./subject.dto";
import { SubjectCreateValid, SubjectUpdateValid } from "./subject.valid";
import { StuSubject } from "src/Entity/stu_subject.entity";
import { HttpResponse } from "src/response/response";
import { ListMetaData, PaginationQuery } from "src/Modules/index.type";
@Controller("subject")
export class SubjectController {
  
  constructor(private readonly SubjectService: SubjectService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async SubjectListsPagination(
    @Query() SubjectQuery: PaginationQuery<SubjectQueryDTO>
  ) {
    const [ error, Subjects ] = await this.SubjectService.SubjectListsPagination(SubjectQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuSubject[]>>(HttpStatus.ACCEPTED, Subjects).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(SubjectCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async SubjectCreate(
    @Body() body: SubjectCreateDTO
  ){
    const [error, InsertResult ] = await this.SubjectService.SubjectCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(SubjectUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async SubjectUpdate(
    @Body() body: SubjectUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.SubjectService.SubjectUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async SubjectDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.SubjectService.SubjectDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}