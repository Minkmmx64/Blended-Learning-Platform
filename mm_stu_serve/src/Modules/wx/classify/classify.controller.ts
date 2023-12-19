import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ClassifyService } from "./classify.service";
import { ClassifyCreateDTO, ClassifyUpdateDTO, ClassifyQueryDTO } from "./classify.dto";
import { ClassifyCreateValid, ClassifyUpdateValid } from "./classify.valid";
import { ClassifyEntity } from "src/Entity/wx/classify";
@Controller("wx/classify")
export class ClassifyController {
  
  constructor(private readonly ClassifyService: ClassifyService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassifyListsPagination(
    @Query() ClassifyQuery: PaginationQuery<ClassifyQueryDTO>
  ) {
    const [ error, Classifys ] = await this.ClassifyService.ClassifyListsPagination(ClassifyQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<ClassifyEntity[]>>(HttpStatus.ACCEPTED, Classifys).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ClassifyCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ClassifyCreate(
    @Body() body: ClassifyCreateDTO
  ){
    const [error, InsertResult ] = await this.ClassifyService.ClassifyCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ClassifyUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ClassifyUpdate(
    @Body() body: ClassifyUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.ClassifyService.ClassifyUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassifyDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.ClassifyService.ClassifyDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }

  @Get("/all")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ClassifyAll(){
    const [ error, classify ] = await this.ClassifyService.ClassifyAll();
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ClassifyEntity[]>(HttpStatus.ACCEPTED, classify).send();
  }
}
