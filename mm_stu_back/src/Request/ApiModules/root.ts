import { AxiosApi } from "../AxiosApis";
import { DataModules } from "../DataModules/DataModules";

export interface RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}

export interface RootLoginDTO {
  username : string;
  password : string;
}

export interface RootRole {
  id: number;
  name: string;
}

export interface UserInfo {
  username: string;
  avatar: string;
  label: string;
  role: RootRole;
  id: number;
}

export interface LoginResponseData {
  token: string;
  user: UserInfo
}

export interface RootInfoEdit {
  avatar: string;
  label: string;
  username: string;
  rusername:string;
}

export class rootdata extends DataModules {
  clientKey = {
    role: {
      type: 'object',
      deep: "role.id"
    }
  };
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

  public info(data: RootInfoEdit) {
    return this.put("/info", data);
  }

  public auth(id: number) {
    return this.get("/auth", { id });
  }

  public teacherAuth(userId: number, code: string) {
    return this.put(`/teacher/${userId}/auth`, { code: code });
  }
}

export default new root();