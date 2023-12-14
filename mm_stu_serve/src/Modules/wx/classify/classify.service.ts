
import { Injectable } from "@nestjs/common";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { ClassifyDAO } from "./classify.dao";
import { ClassifyCreateDTO, ClassifyUpdateDTO, ClassifyQueryDTO } from "./classify.dto";
import { ClassifyEntity } from "src/Entity/wx/classify";

@Injectable()
export class ClassifyService{
  constructor( private readonly ClassifyDAO: ClassifyDAO){}

  public async ClassifyListsPagination(ClassifyQuery: PaginationQuery<ClassifyQueryDTO>): ServiceData<ListMetaData<ClassifyEntity[]>> {
    try {
      const Classifys = await this.ClassifyDAO.ClassifyListsPagination(ClassifyQuery);
      const res: ListMetaData<ClassifyEntity[]> = {
        list: Classifys,
        meta: {
          total: await this.ClassifyDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ClassifyCreate(ClassifyCreate: ClassifyCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.ClassifyDAO.CreateClassify(ClassifyCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ClassifyUpdate(ClassifyUpdate : ClassifyUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.ClassifyDAO.UpdateClassifyById(ClassifyUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ClassifyDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.ClassifyDAO.DeleteClassifyById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ClassifyAll() : ServiceData<ClassifyEntity[]> {
    try {
      const college = await this.ClassifyDAO.ClassifyAll();
      return [ null, college ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}