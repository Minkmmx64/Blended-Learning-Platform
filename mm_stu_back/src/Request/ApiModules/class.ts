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
}

export default new classes();