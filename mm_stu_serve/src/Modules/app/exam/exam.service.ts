import { Injectable } from "@nestjs/common";
import { UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";
import { ExamDAO } from "src/Modules/admin/exam/exam.dao";
import { ServiceData } from "src/Modules/index.type";

@Injectable()
export class AppExamService {

  constructor(
    private readonly ExamDAO: ExamDAO
  ){}

  public async getStudentExamLists(studentId: number, courseId?: number) : ServiceData<UserExam[]> {
    try {
      const exams = await this.ExamDAO.getExamByStudent(studentId, courseId);
      return [ null, exams ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

}