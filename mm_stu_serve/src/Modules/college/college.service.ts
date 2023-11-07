import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CollegeServiceDAO } from "./college.dao";
import { StuCollegeCreateDTO } from "./college.dto";

@Injectable()
export class StuCollegeService {
  
  constructor(public DataSource: DataSource){}

  public CollegeServiceDAO = new CollegeServiceDAO(this.DataSource);

  public async CollegeCreate(college: StuCollegeCreateDTO): Promise<[any, any]> {
    try {
      const result = await this.CollegeServiceDAO.CreateStuCollege(college);
      return [ null, result ]
    } catch (error) {
      return [ error, null ]
    }
  }

  
}