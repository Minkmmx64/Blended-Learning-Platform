import { Injectable } from "@nestjs/common";
import { ExamStatus, UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";
import { StuExam } from "src/Entity/stu_exam.entity";
import { StuSubject } from "src/Entity/stu_subject.entity";
import { ExamDAO } from "src/Modules/admin/exam/exam.dao";
import { PaperDAO } from "src/Modules/admin/paper/paper.dao";
import { ServiceData } from "src/Modules/index.type";
import { ExamResultDTO } from "./exam.dto";
import { UpdateResult } from "typeorm";

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

  public async submitSubjectsResult(ExamResult: ExamResultDTO) : ServiceData<UpdateResult | string> {
    try {
      // 获取该学生作业提交情况
      const studentExamRes = await this.ExamDAO.getStudentExamStatus(ExamResult.dataId.studentId, ExamResult.dataId.examId);

      if(studentExamRes && studentExamRes.exam_status === ExamStatus.uncommitted) {
        // 未提交
        // 将学生答题结果存入数据库
        await this.ExamDAO.InsertStudentExamResult(ExamResult.dataId.studentId, ExamResult.dataId.examId, ExamResult.dataRes);
        // 修改该学生改作业状态为待批阅
        const ok = await this.ExamDAO.toggleStudentExamStatus(ExamResult.dataId.studentId, ExamResult.dataId.examId, ExamStatus.waiting);

        return [ null , ok ];
      } else {
        return [ null , "请勿重复提交" ];
      }
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async getSum(studentId: number, examId: number) : ServiceData<any> {
    try {
      const { sum } = await this.ExamDAO.getStudentGrades(studentId, examId);
      return [ null, parseFloat(sum ?? 0) ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }
}