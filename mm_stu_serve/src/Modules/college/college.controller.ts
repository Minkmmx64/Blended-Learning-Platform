import { BadRequestException, Body, Controller, HttpStatus, Post, Put, UseInterceptors, UsePipes } from "@nestjs/common";
import { StuCollegeService } from "./college.service";
import { ValidationPipe } from "src/utils/pipes";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { StuCollegeCreateSchema } from "./college.valid";
import { StuCollegeCreateDTO } from "./college.dto";
import { HttpResponse } from "src/response/response";

@Controller("/college")
export class StuCollegeController {

  constructor(private StuCollegeService: StuCollegeService){}

  @Post("/create") 
  @UsePipes(new ValidationPipe(StuCollegeCreateSchema))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async CollegeCreate(
    @Body() body: StuCollegeCreateDTO
  ) {
    const [error, college] = await this.StuCollegeService.CollegeCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error).send());
    }
    return new HttpResponse<any>(HttpStatus.RESET_CONTENT, college).send();
  }
}