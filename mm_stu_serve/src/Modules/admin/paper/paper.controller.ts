import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { PaperService } from "./paper.service";
import { PaperCreateDTO, PaperUpdateDTO, PaperQueryDTO } from "./paper.dto";
import { PaperCreateValid, PaperUpdateValid } from "./paper.valid";
import { StuPaper } from "src/Entity/stu_paper.entity";
@Controller("paper")
export class PaperController {
  
  constructor(private readonly PaperService: PaperService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async PaperListsPagination(
    @Query() PaperQuery: PaginationQuery<PaperQueryDTO>
  ) {
    const [ error, Papers ] = await this.PaperService.PaperListsPagination(PaperQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuPaper[]>>(HttpStatus.ACCEPTED, Papers).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(PaperCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async PaperCreate(
    @Body() body: PaperCreateDTO
  ){
    const [error, InsertResult ] = await this.PaperService.PaperCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(PaperUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async PaperUpdate(
    @Body() body: PaperUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.PaperService.PaperUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async PaperDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.PaperService.PaperDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}