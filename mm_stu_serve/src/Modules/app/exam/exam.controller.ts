import { BadRequestException, Controller, Get, HttpStatus, ParseIntPipe, Query } from "@nestjs/common";
import { AppExamService } from "./exam.service";
import { HttpResponse } from "src/response/response";
import { UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";

@Controller("/app/exam")
export class AppExamController {

  constructor(private readonly AppExamService: AppExamService) {}

  @Get("/lists")
  public async getStudentExamLists(
    @Query("studentId") studentId: number,
    @Query("courseId") courseId?: number
  ) {
    const [error, exams ] = await this.AppExamService.getStudentExamLists(studentId, courseId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<UserExam[]>(HttpStatus.RESET_CONTENT, exams).send();
  }
}