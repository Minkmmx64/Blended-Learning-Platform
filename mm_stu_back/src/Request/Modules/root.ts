import { AxiosApi } from "../AxiosApis";

interface RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}

export interface RootLoginDTO {
  username : string;
  password : string;
}

interface RootRole {
  id: number;
  name: string;
  routers: any[] | any;
}

export interface UserInfo {
  username: string,
  avatar: string,
  label: string,
  role: RootRole
}

interface LoginResponseData {
  token: string;
  user: UserInfo
}

export class root extends AxiosApi {
  constructor(){
    super("/api/root");
  }

  public regist(data : RootRegistDTO){
    return this.post("/regist", data);
  }

  public login(data : RootLoginDTO) {
    return this.post<RootLoginDTO,LoginResponseData>("/login", data);
  }
}

export default new root();