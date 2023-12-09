import { AxiosApi } from "../AxiosApis";
import { Gender } from "@/Request/index.type";

export interface TeacherEdit {
  name?: string;
  remark?: string;
  gender: Gender;
  profile: string;
  age: number;
}

export interface TeacherQuery {
  name?: string;
}

export class teacher extends AxiosApi {
  constructor(){
    super("/api/teacher");
  }

}

export default new teacher();