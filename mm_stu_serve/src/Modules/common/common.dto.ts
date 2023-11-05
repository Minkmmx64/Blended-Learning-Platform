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