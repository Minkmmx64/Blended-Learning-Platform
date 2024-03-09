import { AxiosApi } from "../AxiosApis";
import { ISubjectProps } from "@/Request/ApiModules/subject";


export class paper extends AxiosApi {
  constructor(){
    super("/api/paper");
  }

  public async getRelaPaperSubjects(paperId: number) {
    return this.get<{ paperId: number }, ISubjectProps[]>("/relation", { paperId: paperId })
  }

  public async addRelaPaperSubjects(paperId: number, subjects: number[]) {
    return this.post<{ paperId: number,subjects: number[] }>("/relation", { paperId: paperId, subjects: subjects });
  }
}

export default new paper();