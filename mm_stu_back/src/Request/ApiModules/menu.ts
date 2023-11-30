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

  public async all() {
    return this.get("/all", {
      date: new Date()
    });
  }
}

export default new menu();