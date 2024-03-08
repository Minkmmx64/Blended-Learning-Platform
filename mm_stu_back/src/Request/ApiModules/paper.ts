import { AxiosApi } from "../AxiosApis";



export class paper extends AxiosApi {
  constructor(){
    super("/api/paper");
  }

}

export default new paper();