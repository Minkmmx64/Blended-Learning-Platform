import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface ClassEdit {
  name?: string;
  remark?: string;
  college_id: number;
  code: string;
}

export interface ClassQuery {
  name?: string;
  college_id: number;
}

export class classdata extends DataModules {
  
  clientKey = {
    college_id: {
      type: 'object',
      deep: "college.id"
    }
  };
  
}

export class classes extends AxiosApi {
  constructor(){
    super("/api/class");
  }

   //获取班级列表
   public async all() {
    return this.get("/all");
  }
}

export default new classes();