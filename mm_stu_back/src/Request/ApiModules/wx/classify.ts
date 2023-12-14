import { DataModules } from "@/Request/DataModules/DataModules";
import { AxiosApi } from "../../AxiosApis";


export class classifydata extends DataModules {

  clientKey = {
    classify_id : {
      type: "object",
      deep: "classify.id"
    }
  };
}

export class classify extends AxiosApi {
  constructor(){
    super("/api/wx/classify");
  }

  public async all() {
    return this.get("/all")
  }
}

export default new classify();