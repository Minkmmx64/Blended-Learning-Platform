import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export enum SubjectType {
  Signal = "单选题",
  Multiple = "多选题",
  Profile = "简答题",
  Judge = "判断题"
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