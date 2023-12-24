
import { AxiosApi } from "../../AxiosApis";

export class user extends AxiosApi {
    constructor(){
        super("/mongodb/user", "/javaapi");
    }

    public all(){
        return this.get("/all", { date: new Date().getTime()})
    }
}

export default new user();