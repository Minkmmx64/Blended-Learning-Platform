import { StuCollege } from "src/Entity/stu_college.entity";
import { DataSource, InsertResult } from "typeorm";
import { StuCollegeCreateDTO } from "./college.dto";
import { getDate } from "src/utils/date";


export class CollegeServiceDAO {
  constructor(protected DataSource : DataSource){};

  public StuCollegeRepository = this.DataSource.getRepository(StuCollege);

  public async CreateStuCollege(college: StuCollegeCreateDTO): Promise<InsertResult> {
    try {
      return await this.StuCollegeRepository.insert({
        update_time: getDate(),
        create_time: getDate(),
        name: college.name
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}