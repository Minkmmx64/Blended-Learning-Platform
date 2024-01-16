import { Request } from "../env.";

export class common extends Request {
  constructor(){
    super("/common");
  }

  //获取svg 验证码
  public async getSms() {
    return this.get("/sms");
  }

  //验证验证码
  public async VSms(sms: string) {
    return this.post("/sms", { code: sms });
  }

}

export default new common();