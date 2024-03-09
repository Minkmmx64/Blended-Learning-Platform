import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { PaperDAO } from "./paper.dao";
import { PaperCreateDTO, PaperUpdateDTO, PaperQueryDTO, RelaPaperSubjectsDTO } from "./paper.dto";
import { StuPaper } from "src/Entity/stu_paper.entity";
import { StuSubject } from "src/Entity/stu_subject.entity";

@Injectable()
export class PaperService{
  constructor(private readonly DataSource: DataSource){}

  public PaperDAO = new PaperDAO(this.DataSource); 

  public async PaperListsPagination(PaperQuery: PaginationQuery<PaperQueryDTO>): ServiceData<ListMetaData<StuPaper[]>> {
    try {
      const Papers = await this.PaperDAO.PaperListsPagination(PaperQuery);
      const res: ListMetaData<StuPaper[]> = {
        list: Papers,
        meta: {
          total: await this.PaperDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async PaperCreate(PaperCreate: PaperCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.PaperDAO.CreatePaper(PaperCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async PaperUpdate(PaperUpdate : PaperUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.PaperDAO.UpdatePaperById(PaperUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async PaperDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.PaperDAO.DeletePaperById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async RelaPaperSubjects( { paperId, subjects } : RelaPaperSubjectsDTO) : ServiceData<number[]> {
    try {
     // 删除该试卷关联的题目, 并添加
     const res = (await this.PaperDAO.DeletePaperSubjectRelaById(paperId, subjects))
                                                                                    .map( res => res.id);
     return [ null, res ]
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async getRelaPaperSubjectsById(paperId: number) : ServiceData<StuSubject[]> {
    try {
      const res = await this.PaperDAO.getRelaPaperSubjectsById(paperId)                                                                            
      return [ null, res ]
     } catch (error) {
       return [new Error(error), null];
     }
  }
}