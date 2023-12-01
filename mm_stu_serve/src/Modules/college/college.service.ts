import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { CollegeServiceDAO } from "./college.dao";
import { CollegeUpdateDTO, StuCollegeCreateDTO, StuCollegeQueryDTO } from "./college.dto";
import { ListMetaData, PaginationQuery, ServiceData } from "../index.type";
import { StuCollege } from "src/Entity/stu_college.entity";

@Injectable()
export class StuCollegeService {
  
  constructor(public DataSource: DataSource){}

  public CollegeServiceDAO = new CollegeServiceDAO(this.DataSource);

  public async CollegeCreate(college: StuCollegeCreateDTO): ServiceData<InsertResult> {
    try {
      const result = await this.CollegeServiceDAO.CreateStuCollege(college);
      return [ null, result ]
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async CollegeListsPagination(CollegeQuery: PaginationQuery<StuCollegeQueryDTO>): ServiceData<ListMetaData<StuCollege[]>> {
    try {
      const Colleges = await this.CollegeServiceDAO.CollegeListsPagination(CollegeQuery);
      const res: ListMetaData<StuCollege[]> = {
        list: Colleges,
        meta: {
          total: await this.CollegeServiceDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async CollegeUpdate(CollegeUpdate: CollegeUpdateDTO): ServiceData<UpdateResult> {
    try {
      const UpdateResult = await this.CollegeServiceDAO.UpdateCollegeById(CollegeUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
  
  public async CollegeDelete(id: number): ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.CollegeServiceDAO.DeleteCollegeById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}