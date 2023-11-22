import { RootUser } from "src/Entity/root_user.entity";

export class RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}

export class RootLoginDTO {
  username : string;
  password : string;
}

export class RootInfoDTO {
  rusername: string;
  username: string;
  label: string;
  avatar: string;
}

export interface RootLoginUserInfo {
  token: string;
  user: {
    [T in keyof RootUser] ?: RootUser[T]
  }
}