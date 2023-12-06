import { AxiosApi } from "../AxiosApis";

export enum Gender {
  nan = '男',
  nv = '女'
}

export interface StuEdit {

}

export interface StuQuery {

}


export class stu extends AxiosApi {
  constructor(){
    super("/api/stu")
  }
}

export default new stu();