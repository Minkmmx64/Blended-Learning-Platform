import { BadRequestException, Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { IndexService } from "./index.service";

@Controller("/app")
export class IndexController {
  
  constructor(private readonly IndexService: IndexService){}

  //首页课程
  @Get("/index/course/list")
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
  @Get("/index/chapter/:courseId")
  public async getChaptersByCourseId(
    @Param("courseId") courseId: number
  ) {
    const [ error, chapters ] = await this.IndexService.getChaptersByCourseId(courseId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, chapters).send();
  }

  //通过班级Id获取课表
  @Get("/class/student/:classId")
  public async getStudentCourseTables(
    @Param("classId") classId: number
  ) {
    const [ error, tables ] = await this.IndexService.getStudentCourseTables(classId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, tables).send();
  }

  //通过章节Id获取章节资源
  @Get("/chapter/resource/:chapterId")
  public async getChapterResource(
    @Param("chapterId") chapterId: number
  ) {
    const [ error, resources ] = await this.IndexService.getChapterResource(chapterId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, resources).send();
  }

}








