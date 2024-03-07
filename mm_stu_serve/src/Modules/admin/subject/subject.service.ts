import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { SubjectDAO } from "./subject.dao";
import { SubjectCreateDTO, SubjectUpdateDTO, SubjectQueryDTO } from "./subject.dto";
import { StuSubject } from "src/Entity/stu_subject.entity";

@Injectable()
export class SubjectService{
  constructor(private readonly DataSource: DataSource){}

  public SubjectDAO = new SubjectDAO(this.DataSource); 

  public async SubjectListsPagination(SubjectQuery: PaginationQuery<SubjectQueryDTO>): ServiceData<ListMetaData<StuSubject[]>> {
    try {
      const Subjects = await this.SubjectDAO.SubjectListsPagination(SubjectQuery);
      const res: ListMetaData<StuSubject[]> = {
        list: Subjects,
        meta: {
          total: await this.SubjectDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async SubjectCreate(SubjectCreate: SubjectCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.SubjectDAO.CreateSubject(SubjectCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async SubjectUpdate(SubjectUpdate : SubjectUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.SubjectDAO.UpdateSubjectById(SubjectUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async SubjectDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.SubjectDAO.DeleteSubjectById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}