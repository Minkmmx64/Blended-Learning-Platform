import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ExamCreateDTO, ExamQueryDTO, ExamUpdateDTO } from "./exam.dto";
import { ToOrder } from "src/common/common";
import { StuExam } from "src/Entity/stu_exam.entity";
import { ExamStatus, UserExam } from "src/Entity/relation_mm_stu_user_exam.entity";
import { Injectable } from "@nestjs/common";
import { StuExamResult } from "src/Entity/stu_exam_result.entity";
import { SubjectAnswer } from "src/Modules/app/exam/exam.dto";

@Injectable()
export class ExamDAO {
  constructor(protected DataSource: DataSource){}

  //试卷实体
  public ExamRepository = this.DataSource.getRepository(StuExam);

  //学生提交试卷实体
  public ExamRecordRepository = this.DataSource.getRepository(UserExam);

  //学生答题实体
  public StudentSubjectResRepository = this.DataSource.getRepository(StuExamResult);

  public async ExamListsPagination(ExamQuery: PaginationQuery<ExamQueryDTO>): Promise<StuExam[]> {

    const Order = ToOrder(ExamQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuExam> = this.ExamRepository.createQueryBuilder().select();

    return await SelectQueryBuilder
                                   .orderBy(ExamQuery.prop, Order)
                                   .skip(ExamQuery.limit * (ExamQuery.offset - 1))
                                   .take(ExamQuery.limit)
                                   .getMany();
  }

  public async CreateExam(CreateExam: ExamCreateDTO): Promise<InsertResult> {

    const result = await this.ExamRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuExam)
                             .values({
                                name: CreateExam.name,
                                course: { id: CreateExam.courseId },
                                paper: { id: CreateExam.paperId },
                                teacher: { id: CreateExam.teacherId },
                                class: { id: CreateExam.classId },
                                time: CreateExam.time
                             }).execute();
    return result;
  }

  public async UpdateExamById(UpdateExam: ExamUpdateDTO): Promise<UpdateResult> {

    const result = await this.ExamRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                            
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateExam.id)
                             .execute();
    return result;
  }

  public async DeleteExamById(id: number) : Promise<DeleteResult> {

    const result = await this.ExamRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.ExamRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  public async InsertStudentExamRecord(students: number[], examId: number) {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const task = () : Promise<InsertResult[]> => {
        return new Promise((resolve, reject) => {
          Promise.all(students.map(
            async id => await this.ExamRecordRepository
                            .createQueryBuilder("exam_record", queryRunner)
                            .insert()
                            .values({
                              exam: { id: examId },
                              student: { id: id }
                            }).execute()
          )).then(resolve).catch(reject);
        });
      }

      const results = await task();
    
      await queryRunner.commitTransaction();

      return results;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async getExamByStudent(studentId: number, courseId?: number) {

    const createQueryBuilder = this.ExamRecordRepository
                                   .createQueryBuilder("record")
                                   .leftJoinAndSelect("record.exam", "exam")
                                   .leftJoinAndSelect("exam.course", "course")
                                   .leftJoinAndSelect("exam.class", "class")
                                   .leftJoinAndSelect("exam.teacher", "teacher")
                                   .andWhere("record.student = :studentId")
                                   .setParameter("studentId", studentId)
    
    if(courseId) {
      createQueryBuilder
                        .andWhere("course.id = :courseId")
                        .setParameter("courseId", courseId)
    }
    
    return await createQueryBuilder.getMany();
                     
  }

  public async getExamById(examId: number) : Promise<StuExam> {
    return await this.ExamRepository
                     .createQueryBuilder("exam")
                     .leftJoinAndSelect("exam.paper", "paper")
                     .andWhere("exam.id = :examId")
                     .setParameter("examId", examId)
                     .getOne();
  }

  public async getStudentExamStatus(studentId: number, examId: number) {
    return await this.ExamRecordRepository
                     .createQueryBuilder()
                     .select()
                     .andWhere("student = :studentId")
                     .setParameter("studentId", studentId)
                     .andWhere("exam = :examId")
                     .setParameter("examId", examId)
                     .getOne();
  }

  public async toggleStudentExamStatus(studentId: number, examId: number, exam_status: ExamStatus) {
    return await this.ExamRecordRepository
                     .createQueryBuilder()
                     .update()
                     .set({ exam_status: exam_status })
                     .where("student = :studentId")
                     .setParameter("studentId", studentId)
                     .andWhere("exam = :examId")
                     .setParameter("examId", examId)
                     .execute();   
  }

  public async InsertStudentExamResult(studentId: number, examId: number, datas: SubjectAnswer[]) {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const task = await Promise.all( datas.map( ({ id, value }) => {
                                                                  return this.StudentSubjectResRepository
                                                                             .createQueryBuilder()
                                                                             .insert()
                                                                             .values({ 
                                                                                subject: { id: id }, 
                                                                                result: value,
                                                                                exam: { id: examId },
                                                                                student: { id: studentId }
                                                                              })
                                                                             .execute();
                                                                  })
      );

      await queryRunner.commitTransaction();

      return task;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
}
