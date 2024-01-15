import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface RoleEdit {
  name?: string;
  menus: number[];
  remark?: string;
}

export interface RoleQuery {
  name?: string;
}

export class role extends AxiosApi {
  constructor(){
    super("/api/role");
  }

  public all(){
    return this.get("/all");
  }
}

export default new role();