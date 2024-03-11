import { BadRequestException, Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from "@nestjs/common";
import { AppExamService } from "./exam.service";
import { HttpResponse } from "src/response/response";
import { UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";
import { StuExam } from "src/Entity/stu_exam.entity";
import { StuSubject } from "src/Entity/stu_subject.entity";

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

  @Get("/:examId")
  public async getExamById(
    @Param("examId") examId: number
  ) {
    const [error, exam ] = await this.AppExamService.getExamById(examId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<StuExam>(HttpStatus.RESET_CONTENT, exam).send();
  }

  @Get("/paper/:paperId")
  public async getPaperSubjectsByPaperId(
    @Param("paperId") paperId: number
  ) {
    const [error, subjects ] = await this.AppExamService.getPaperSubjectsByPaperId(paperId);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<StuSubject[]>(HttpStatus.RESET_CONTENT, subjects).send();
  }
}