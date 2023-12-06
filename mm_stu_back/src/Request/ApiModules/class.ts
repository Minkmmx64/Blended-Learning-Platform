import { AxiosApi } from "../AxiosApis";

export interface ClassEdit {
  name?: string;
  remark?: string;
  college_id: number;
}

export interface ClassQuery {
  name?: string;
  college_id: number;
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