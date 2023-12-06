import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../index.type";
import { ClassCreateDTO, ClassQueryDTO, ClassUpdateDTO } from "./class.dto";
import { ClassService } from "./class.service";
import { HttpResponse } from "src/response/response";
import { StuClass } from "src/Entity/stu_class.entity";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ClassCreateValid, ClassUpdateValid } from "./class.valid";

@Controller("class")
export class ClassController {
  
  constructor(private readonly ClassService: ClassService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassListsPagination(
    @Query() ClassQuery: PaginationQuery<ClassQueryDTO>
  ) {
    const [ error, classes ] = await this.ClassService.ClassListsPagination(ClassQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuClass[]>>(HttpStatus.ACCEPTED, classes).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ClassCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ClassCreate(
    @Body() body: ClassCreateDTO
  ){
    const [error, InsertResult ] = await this.ClassService.ClassCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ClassUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ClassUpdate(
    @Body() body: ClassUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.ClassService.ClassUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.ClassService.ClassDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }

  @Get("/all")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassAll(){
    const [ error, classes ] = await this.ClassService.ClassAll();
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<StuClass[]>(HttpStatus.ACCEPTED, classes).send();
  }
}