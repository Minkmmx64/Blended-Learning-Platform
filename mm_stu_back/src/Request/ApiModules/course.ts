import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface CourseEdit {
  name?: string;
  remark?: string;
  avatar?: string;
  college_id?: number;
}

export interface CourseQuery {
  name?: string;
  college_id?: number;
}

export class coursedata extends DataModules {
  
  clientKey = {
    college_id: {
      type: 'object',
      deep: "college.id"
    }
  };

  serviceKey = {

  };
}

export class course extends AxiosApi {
  constructor(){
    super("/api/course");
  }

  public async all(){
    return this.get("/all", { date: new Date().getTime() })
  }
}

export default new course();