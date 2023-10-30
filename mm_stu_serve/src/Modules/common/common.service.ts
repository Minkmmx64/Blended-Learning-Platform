import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
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
}