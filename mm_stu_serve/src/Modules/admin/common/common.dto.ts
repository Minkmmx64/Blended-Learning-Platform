import { StuFileResource } from "src/Entity/stu_file_resource.entity";

export class SmsDTO {
  code: string;
}

export class TokenDTO {
  uuid: string;
  skey: string;
  //用户权限
  role: number;
}

export class vTokenDTO {
  token: string;
}


export interface IFileUploadStart {
  md5: string;
  chunk: number;
}

export interface IFileisExist {
  exist?: StuFileResource
}

export interface RedisFileSliceData {
  suf: string;
  number: number;
}