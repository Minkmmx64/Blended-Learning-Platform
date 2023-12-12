import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ChapterService } from "./chapter.service";
import { ChapterCreateDTO, ChapterUpdateDTO, ChapterQueryDTO } from "./chapter.dto";
import { ChapterCreateValid, ChapterUpdateValid } from "./chapter.valid";
import { StuChapter } from "src/Entity/stu_chapter.entity";
@Controller("chapter")
export class ChapterController {
  
  constructor(private readonly ChapterService: ChapterService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ChapterListsPagination(
    @Query() ChapterQuery: PaginationQuery<ChapterQueryDTO>
  ) {
    const [ error, Chapters ] = await this.ChapterService.ChapterListsPagination(ChapterQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuChapter[]>>(HttpStatus.ACCEPTED, Chapters).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ChapterCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ChapterCreate(
    @Body() body: ChapterCreateDTO
  ){
    const [error, InsertResult ] = await this.ChapterService.ChapterCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ChapterUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ChapterUpdate(
    @Body() body: ChapterUpdateDTO
  ){
    const [ error, UpdateResult ] = await this.ChapterService.ChapterUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async ChapterDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.ChapterService.ChapterDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}