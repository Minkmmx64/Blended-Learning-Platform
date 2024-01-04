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

  public upload(data: FormData) {
    return this.post("/upload", data, {
      "headers" : {
        "Content-Type" : "multipart/form-data"
      }
    })
  }

  public uploadSlice(data: FormData) {
    return this.post("/upload/slice", data, {
      "headers" : {
        "Content-Type" : "multipart/form-data"
      }
    })
  }

  public FileUploadStart(md5: string, filename: string) {
    return this.get("/upload/slice/start", { date: new Date().toString(), md5, filename });
  }

  // public rToken() {
  //   return this.get<null, { token: string }>("/rtoken");
  // }

  public test(){
    return this.get("/test", { date: new Date().getTime()});
  }
}

export default new CommonApi();