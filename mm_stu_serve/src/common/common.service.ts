import { Injectable } from "@nestjs/common";
import { Response, Request } from "express";
import { svgCode } from "src/utils/sms";

@Injectable()
export class CommonService {

    public getSmsCode(req: Request, res: Response, session: Record<string , any>){
        const svg = svgCode({
            height: 40
        });
        res.cookie("sessionId", req.sessionID);
        session.sms = svg.text;
        return svg.data;
    }

    public vSmsCode(req: Request, code : string, session: Record<string , any>) {
        console.log(session);
        //const sms = req.sessionStore.sessions[req.cookies["sessionId"]];
        return code;
    }
}