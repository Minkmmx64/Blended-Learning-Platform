import { DataModules } from "@/Request/DataModules/DataModules";
import { AxiosApi } from "../../AxiosApis";

export class shopdata extends DataModules {
  serviceKey = {

  };

  clientKey = {
    detail : {
      type: "JSON",
    },
    classify_id : {
      type: "object",
      deep: "classify.id"
    },
  }
}

export class shop extends AxiosApi {
  constructor(){
    super("/api/wx/shop");
  }
}

export default new shop();