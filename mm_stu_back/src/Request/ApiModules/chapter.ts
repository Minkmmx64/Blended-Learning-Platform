import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface ChapterEdit {
  name?: string;
  pid?: number;
  id?: number;
  remark?:string;
  cover?: string;
  course: number;
}

export interface ChapterQuery {
  name?: string;
  course: number;
}

export class chapterdata extends DataModules {
  
  clientKey = {
    course: {
      type: 'object',
      deep: "course.id"
    }
  };
  
}

export class chapter extends AxiosApi {
  constructor(){
    super("/api/chapter");
  }

  public async all() {
    return this.get("/all", {
      date: new Date()
    });
  }
}

export default new chapter();