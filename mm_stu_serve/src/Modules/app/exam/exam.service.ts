import { Injectable } from "@nestjs/common";
import { UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";
import { StuExam } from "src/Entity/stu_exam.entity";
import { StuSubject } from "src/Entity/stu_subject.entity";
import { ExamDAO } from "src/Modules/admin/exam/exam.dao";
import { PaperDAO } from "src/Modules/admin/paper/paper.dao";
import { ServiceData } from "src/Modules/index.type";

@Injectable()
export class AppExamService {

  constructor(
    private readonly ExamDAO: ExamDAO,
    private readonly PaperDAO: PaperDAO
  ){}

  public async getStudentExamLists(studentId: number, courseId?: number) : ServiceData<UserExam[]> {
    try {
      const exams = await this.ExamDAO.getExamByStudent(studentId, courseId);
      return [ null, exams ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async getExamById(examId: number) : ServiceData<StuExam> {
    try {
      const exam = await this.ExamDAO.getExamById(examId);
      return [ null, exam ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async getPaperSubjectsByPaperId(paperId: number) : ServiceData<StuSubject[]> {
    try {
      const subjects = await this.PaperDAO.getRelaPaperSubjectsById(paperId);
      return [ null, subjects ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }
}