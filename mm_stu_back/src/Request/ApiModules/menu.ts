import { AxiosApi } from "../AxiosApis";

export interface MenuQueryDTO {
  name?: string;
  pid?: number;
}

export class menu extends AxiosApi {
  constructor(){
    super("/api/menu");
  }
}

export default new menu();