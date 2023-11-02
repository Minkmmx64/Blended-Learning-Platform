import { Injectable } from "@nestjs/common";
import { JWT } from "src/utils/crypto";
import { svgCode } from "src/utils/sms";

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
    try {
      const result = JWT.verify(token);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error).message, null ];
    }
  }
}