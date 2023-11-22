import { Injectable } from "@nestjs/common";
import { DataSource, InsertResult } from "typeorm";
import { CollegeServiceDAO } from "./college.dao";
import { StuCollegeCreateDTO } from "./college.dto";
import { ServiceData } from "../index.type";

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

  
}