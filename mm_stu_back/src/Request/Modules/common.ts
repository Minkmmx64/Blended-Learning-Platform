import { ElMessage } from "element-plus";
import { AxiosApi } from "../AxiosApis";

export class CommonApi extends AxiosApi {
  constructor(){
    super("/api/common");
  }

  public Sms(){
    return this.get("/sms", null)
  }

  public vSms(code: string){
    return this.post("/sms", { code });
  }

  public vToken(token: string) {
    return this.post("/vtoken", { token });
  }
}

export default new CommonApi();