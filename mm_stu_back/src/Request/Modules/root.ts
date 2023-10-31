import { AxiosApi } from "../AxiosApis";

interface RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}


interface RootLoginDTO {
  username : string;
  password : string;
}

export class root extends AxiosApi {
  constructor(){
    super("/api/root");
  }

  public regist(data : RootRegistDTO){
    return this.post("/regist", data);
  }

  public login(data : RootLoginDTO) {
    return this.post("/login", data);
  }
}

export default new root();