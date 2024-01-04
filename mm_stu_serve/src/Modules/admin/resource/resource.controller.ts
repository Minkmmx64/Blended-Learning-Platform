import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { resourceService } from "./resource.service";
import { resourceCreateDTO, resourceUpdateDTO, resourceQueryDTO } from "./resource.dto";
import { resourceCreateValid, resourceUpdateValid } from "./resource.valid";
import { StuCourseResource } from "src/Entity/stu_course_resource.entity";
@Controller("resource")
export class resourceController {
  
  constructor(private readonly resourceService: resourceService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async resourceListsPagination(
    @Query() resourceQuery: PaginationQuery<resourceQueryDTO>
  ) {
    const [ error, resources ] = await this.resourceService.resourceListsPagination(resourceQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuCourseResource[]>>(HttpStatus.ACCEPTED, resources).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(resourceCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async resourceCreate(
    @Body() body: resourceCreateDTO
  ){
    const [error, InsertResult ] = await this.resourceService.resourceCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(resourceUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async resourceUpdate(
    @Body() body: resourceUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.resourceService.resourceUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async resourceDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.resourceService.resourceDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}