import { AxiosApi } from "../AxiosApis";

export interface CollegeEdit {
  name?: string;
  remark?: string;
}

export interface CollegeQuery {
  name?: string;
}

export class college extends AxiosApi {
  constructor(){
    super("/api/college");
  }
}

export default new college();