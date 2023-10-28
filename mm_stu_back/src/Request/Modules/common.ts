import { AxiosApi } from "../AxiosApis";

export class CommonApi extends AxiosApi<any> {
  constructor(){
    super("/api/common");
  }

  public Sms(){
    return this.get("/sms", null ,  {
      headers: {
        "auth" : "nomjw"
      }
    })
  }

  public vSms(code: string){
    return this.post("/sms", { code });
  }
}

export default new CommonApi();