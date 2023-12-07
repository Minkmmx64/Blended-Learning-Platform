import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export enum Gender {
  nan = '男',
  nv = '女'
}

export interface StuEdit {
  name: string;
  class_id: number;
  gender: Gender;
  year: number;
  age: number;
  native: string[];
  avatar: string;
  // school: string;
}

export interface StuQuery {
  name: string;
  class_id: number;
}

export class studata extends DataModules {
  

  clientKey = {
    class_id: {
      type: "object",
      deep: "class.id"
    },
    native: {
      type: "array",
      deep: ","
    }
  }

  serviceKey = {
    native : {
      type: "string"
    }
  }
}

export class stu extends AxiosApi {
  constructor(){
    super("/api/stu")
  }
}

export default new stu();