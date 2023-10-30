import { AxiosApi } from "../AxiosApis";

interface RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}

export class root extends AxiosApi {
  constructor(){
    super("/api/root");
  }

  public regist(data : RootRegistDTO){
    return this.post("/regist", data);
  }
}

export default new root();