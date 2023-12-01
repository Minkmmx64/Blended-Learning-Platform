import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, UseInterceptors, UsePipes, UseGuards, Put, Delete } from "@nestjs/common";
import { StuCollegeService } from "./college.service";
import { ValidationPipe } from "src/utils/pipes";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { MenuUpdateValid, StuCollegeCreateValid } from "./college.valid";
import { CollegeUpdateDTO, StuCollegeCreateDTO } from "./college.dto";
import { HttpResponse } from "src/response/response";
import { AuthGuard } from "src/guard/auth.gurad";
import { ListMetaData, PaginationQuery } from "../index.type";
import { StuCollege } from "src/Entity/stu_college.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Controller("/college")
export class StuCollegeController {

  constructor(private StuCollegeService: StuCollegeService){}

  //创建学院
  @Post("/create") 
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(StuCollegeCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async CollegeCreate(
    @Body() body: StuCollegeCreateDTO
  ) {
    const [error, college] = await this.StuCollegeService.CollegeCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse(HttpStatus.RESET_CONTENT, college).send();
  }

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async CollegeList(
    @Query() Query: PaginationQuery<StuCollegeCreateDTO>
  ) {
    const [ error, colleges ] = await this.StuCollegeService.CollegeListsPagination(Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuCollege[]>>(HttpStatus.ACCEPTED, colleges).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(MenuUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async CollegeUpdate(
    @Body() Body : CollegeUpdateDTO
  ) {
    const [ error, UpdateResult ] = await this.StuCollegeService.CollegeUpdate(Body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }


  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async CollegeDelete(
    @Query("id") id: number,
  ) {
    const [ error, DeleteResult ] = await this.StuCollegeService.CollegeDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }

}