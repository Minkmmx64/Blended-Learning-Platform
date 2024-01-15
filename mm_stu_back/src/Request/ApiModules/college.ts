import { AxiosApi } from "../AxiosApis";

export interface CollegeEdit {
  name?: string;
  remark?: string;
  code: string;
}

export interface CollegeQuery {
  name?: string;
}

export class college extends AxiosApi {
  constructor(){
    super("/api/college");
  }

  //获取学院列表
  public async all() {
    return this.get("/all");
  }
}

export default new college();