import { AxiosApi } from "../AxiosApis";

export interface MenuEdit {
  name?: string;
  pid?: number;
  key?: string;
  id?: number;
}

export interface MenuQuery {
  name?: string;
}

export class menu extends AxiosApi {
  constructor(){
    super("/api/menu");
  }
}

export default new menu();