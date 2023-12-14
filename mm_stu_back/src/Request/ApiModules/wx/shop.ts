import { AxiosApi } from "../../AxiosApis";


export class shop extends AxiosApi {
  constructor(){
    super("/api/wx/shop");
  }
}

export default new shop();