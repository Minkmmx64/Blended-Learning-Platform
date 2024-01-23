import { BadRequestException, Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { IndexService } from "./index.service";

@Controller("/app/index")
export class IndexController {
  
  constructor(private readonly IndexService: IndexService){}

  //首页课程
  @Get("/course/list")
  public async IndexCourseLists(
   @Query("offset") offset: number,
   @Query("limit") limit: number,
  ) {
    const [ error, Indexs ] = await this.IndexService.IndexCourseLists(offset, limit);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, Indexs).send();
  }

  //通过课程id获取章节
  @Get("/chapter/:courseId")
  public async getChaptersByCourseId(
    @Param("courseId") courseId: number
  ) {
    const [ error, chapters ] = await this.IndexService.getChaptersByCourseId(courseId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, chapters).send();
  }

}