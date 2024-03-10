import { AxiosApi } from "../AxiosApis";

export interface IExam {
    name: string;
    paperId: string;
    time: string;
    courseId: string;
    classId: string;
    teacherId: number;
}

export class exam extends AxiosApi {
    constructor(){
        super("/api/exam");
    }

    public async create(data: IExam){
        return this.post("/create", data);
    }
}

export default new exam();