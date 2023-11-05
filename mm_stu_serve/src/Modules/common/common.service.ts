import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { JWT } from "src/utils/crypto";
import { svgCode } from "src/utils/sms";
import { TokenDTO } from "./common.dto";

@Injectable()
export class CommonService {

  public getSmsCode(session: Record<string, any>) : string {
    const svg = svgCode({ height: 40 });
    session.sms = svg.text;
    return svg.data;
  }

  public vSmsCode(code: string, session: Record<string, any>) : boolean {
    try {
      const sms = session.sms as string;
      return code.toLowerCase() === sms.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  public vToken(token: string) {
    return JWT.verify(token);
  }

  public rToken(Authorization: string) : [any, string] {
    const [ error, verify ] = JWT.verify(Authorization);
    if(error) {
      if(error === "TokenExpiredError: jwt expired") {
        const deToken = JWT.decode(Authorization) as TokenDTO;
        //过期了先解包里面的用户数据，如权限id
        const token = JWT.genToken({
          uuid: randomUUID(),
          skey: JWT.secret,
          role: deToken.role
        });
        return [null, token];
      } else return [ "用户信息无效", null ];
    }
  }
}