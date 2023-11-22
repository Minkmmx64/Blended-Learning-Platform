import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, UseInterceptors, UsePipes, UseGuards } from "@nestjs/common";
import { StuCollegeService } from "./college.service";
import { ValidationPipe } from "src/utils/pipes";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { StuCollegeCreateSchema } from "./college.valid";
import { StuCollegeCreateDTO } from "./college.dto";
import { HttpResponse } from "src/response/response";
import { AuthGuard } from "src/guard/auth.gurad";

@Controller("/college")
export class StuCollegeController {

  constructor(private StuCollegeService: StuCollegeService){}

  //创建学院
  @Post("/create") 
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(StuCollegeCreateSchema))
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

  //获取学院列表
  // @Get("/list")
  // @UseInterceptors(new TokenExpireInterceptor())
  // public async CollegeList(
  //   @Query() query: any
  // ) {
  //   return new HttpResponse<any>(HttpStatus.ACCEPTED, query).send();
  // }
}