import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface CourseEdit {
  name?: string;
  remark?: string;
  avatar?: string;
}

export interface CourseQuery {
  name?: string;
}

export class coursedata extends DataModules {
  
  clientKey = {
    
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