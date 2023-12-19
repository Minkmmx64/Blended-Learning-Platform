import { Body, Controller, Post } from "@nestjs/common";
import * as https from "https";
import { WXService } from "./wx.service";

@Controller("wx")
export class WXController {

  constructor(private readonly WXService: WXService){}

  @Post("/code")
  public async code(
    @Body("code") code: string 
  ) {
    const wx = {
      appid: "wx4c81eb350eded834",
      secret: "b2abfa52a8a5ec454391947497492107"
    }
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wx.appid}&secret=${wx.secret}&js_code=${code}&grant_type=authorization_code`
    const request = () => {
      return new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let list = [];
          res.on('data', chunk => {
              list.push(chunk);
          });
          res.on('end', () => {
            const data = JSON.parse(Buffer.concat(list).toString());
            resolve(data);
          });
          res.on("error", reject);
        })
      })
    }

    const data = await request() as any;
    if(data.errmsg) {
      return {
        session_key: "wx_project_test",
        openid: "openid"
      }
    }
    return data;
  }
}
