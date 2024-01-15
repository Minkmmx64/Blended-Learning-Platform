import {DataModules} from "@/Request/DataModules/DataModules";
import {AxiosApi} from "@/Request/AxiosApis";

export class resourcedata extends DataModules {

    clientKey = {
        // class_id: {
        //     type: "object",
        //     deep: "class.id"
        // },
        // native: {
        //     type: "splitarray",
        //     deep: ","
        // }
        chapter_id: {
            type: "object",
            deep: "chapter.id"
        }
    }

    serviceKey = {

    }
}

export class resource extends AxiosApi {
    constructor(){
        super("/api/resource")
    }
}

export default new resource();