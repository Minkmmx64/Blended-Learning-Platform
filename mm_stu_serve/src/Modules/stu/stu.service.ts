import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../index.type";
import { StuDAO } from "./stu.dao";
import { StuCreateDTO, StuQueryDTO, StuUpdateDTO } from "./stu.dto";
import { StuInfo } from "src/Entity/stu_info.entity";

@Injectable()
export class StuService{
  constructor(private readonly DataSource: DataSource){}

  public StuDAO = new StuDAO(this.DataSource); 

  public async StuListsPagination(StuQuery: PaginationQuery<StuQueryDTO>): ServiceData<ListMetaData<StuInfo[]>> {
    try {
      const Stus = await this.StuDAO.StuListsPagination(StuQuery);
      const res: ListMetaData<StuInfo[]> = {
        list: Stus,
        meta: {
          total: await this.StuDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async StuCreate(StuCreate: StuCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.StuDAO.CreateStu(StuCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async StuUpdate(StuUpdate : StuUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.StuDAO.UpdateStuById(StuUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async StuDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.StuDAO.DeleteStuById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}