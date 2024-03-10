import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { ExamDAO } from "./exam.dao";
import { ExamCreateDTO, ExamUpdateDTO, ExamQueryDTO } from "./exam.dto";
import { StuExam } from "src/Entity/stu_exam.entity";
import { StuDAO } from "../stu/stu.dao";

@Injectable()
export class ExamService{
  constructor(
    private readonly DataSource: DataSource,
    private readonly StuDAO: StuDAO
  ){}

  public ExamDAO = new ExamDAO(this.DataSource); 

  public async ExamListsPagination(ExamQuery: PaginationQuery<ExamQueryDTO>): ServiceData<ListMetaData<StuExam[]>> {
    try {
      const Exams = await this.ExamDAO.ExamListsPagination(ExamQuery);
      const res: ListMetaData<StuExam[]> = {
        list: Exams,
        meta: {
          total: await this.ExamDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ExamCreate(ExamCreate: ExamCreateDTO) : ServiceData<InsertResult[]>{
    try {
      const result = await this.ExamDAO.CreateExam(ExamCreate);
      //再创建学生-考试关系记录
      const students = (await this.StuDAO.getStudentInfoClass(ExamCreate.classId)).map( student => student.id);
      return [ null, await this.ExamDAO.InsertStudentExamRecord(students, result.identifiers[0].id) ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ExamUpdate(ExamUpdate : ExamUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.ExamDAO.UpdateExamById(ExamUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ExamDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.ExamDAO.DeleteExamById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}