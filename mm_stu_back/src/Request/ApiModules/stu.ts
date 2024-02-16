import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";
import { Gender } from "../index.type";

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

export interface User {
	id: number;
	create_time: string;
	update_time: string;
	status: boolean;
	remark?: any;
	username: string;
	password: string;
	avatar?: any;
	label?: any;
	phone: string;
	type: string;
}

export interface Student {
	id: number;
	create_time: string;
	update_time: string;
	status: boolean;
	remark?: any;
	student: string;
	school: string;
	name: string;
	native: string;
	year: number;
	gender: string;
	age: number;
	avatar: string;
	user: User;
}

export class studata extends DataModules {
  

  clientKey = {
    class_id: {
      type: "object",
      deep: "class.id"
    },
    native: {
      type: "splitarray",
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

  public async getStudentInfoClass(classId: number) {
    return this.get< any , Student[]>(`/${classId}`);
  }

}

export default new stu();