import { AxiosApi } from "../../AxiosApis";

export class serve extends AxiosApi {
  constructor(){
    super("/mongodb/serve", "/javaapi");
  }

  public all(){
    return this.get("/all", { date: new Date().getTime()})
  }
}

export default new serve();