import { StuCollege } from "src/Entity/stu_college.entity";
import { DataSource, InsertResult } from "typeorm";
import { StuCollegeCreateDTO } from "./college.dto";

export class CollegeServiceDAO {
  constructor(protected DataSource : DataSource){};

  public StuCollegeRepository = this.DataSource.getRepository(StuCollege);

  public async CreateStuCollege(college: StuCollegeCreateDTO): Promise<InsertResult> {
    try {
      return await this.StuCollegeRepository.insert({
        name: college.name
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}