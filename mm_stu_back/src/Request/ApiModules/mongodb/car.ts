

import { AxiosApi } from "../../AxiosApis";

export class car extends AxiosApi {
    constructor(){
        super("/mongodb/car", "/javaapi");
    }

    public all() {
        return this.get("/all", { date : new Date().getTime()} );
    }
}

export default new car();