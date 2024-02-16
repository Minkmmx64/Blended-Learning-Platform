
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { SignDAO } from "./sign.dao";
import { SignCreateDTO, SignUpdateDTO, SignQueryDTO } from "./sign.dto";
import { StuSign } from "src/Entity/stu_sign.entity";

@Injectable()
export class SignService{
  constructor(private readonly DataSource: DataSource){}

  public SignDAO = new SignDAO(this.DataSource); 

  public async SignListsPagination(SignQuery: PaginationQuery<SignQueryDTO>): ServiceData<ListMetaData<StuSign[]>> {
    try {
      const Signs = await this.SignDAO.SignListsPagination(SignQuery);
      const res: ListMetaData<StuSign[]> = {
        list: Signs,
        meta: {
          total: await this.SignDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async SignCreate(SignCreate: SignCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.SignDAO.CreateSign(SignCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async SignUpdate(SignUpdate : SignUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.SignDAO.UpdateSignById(SignUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async SignDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.SignDAO.DeleteSignById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}