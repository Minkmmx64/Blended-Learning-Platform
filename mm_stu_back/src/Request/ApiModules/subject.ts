import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export enum SubjectType {
  Signal = "单选题",
  Multiple = "多选题",
  Profile = "简答题",
  Judge = "判断题"
}

export interface ISubjectProps {
  id: number;
  remark?: string;
  describe: string;
  type: string;
  result: string;
  options: string; // JSON格式的数组
  classify: string;
  points: number;
}

export class subjectdata extends DataModules {

  clientKey = {
    options: {
      type: "JSON",
    }
  }

  serviceKey = {
    options : {
     
    }
  }
}

export class subject extends AxiosApi {
  constructor(){
    super("/api/subject");
  }

}

export default new subject();