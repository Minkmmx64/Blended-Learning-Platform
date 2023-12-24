import { AxiosApi } from "../../AxiosApis";

export class record extends AxiosApi {
    constructor(){
        super("/mongodb/record", "/javaapi");
    }
}

export default new record();