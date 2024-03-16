import { AxiosApi } from "../AxiosApis";

export interface IExam {
    name: string;
    paperId: string;
    time: string;
    courseId: string;
    classId: string;
    teacherId: number;
}

export interface AssignGroup {
	exam_id: number;
	exam_name: string;
	course_id: number;
	course_name: string;
	count: string;
	successful: string;
	uncommitted: string;
	waiting: string;
  class_id: number;
  class_name: string;
  paper_id: number;
  paper_name: string;
}

export enum ExamStatus {
  uncommitted = "未提交",
  waiting = "等待阅卷",
  successful = "批改完成"
}

export interface IgetStudentExamInfo {
	id: number;
	grades: number;
	exam_status: ExamStatus;
	student: {
    id: number;
    name: string;
  }
}

export interface AnswerResult {
	result: string;
	teacher_comment?: string;
	ultimate?: number;
}

export class exam extends AxiosApi {
    constructor(){
        super("/api/exam");
    }

    public async create(data: IExam){
        return this.post("/create", data);
    }

    public async getAssign(teacherId: number) {
      return this.get<number, AssignGroup[]>(`/${teacherId}`)
    }

    public async getStudentExamInfo(examId: number) {
      return this.get<number, IgetStudentExamInfo[]>(`/student/${examId}`)
    }

    public async getStudentSubject(studentId: number, examId: number, subjectId: number) {
      return this.get<any, AnswerResult>('/result', { studentId: studentId, examId: examId , subjectId: subjectId });
    }

    public async postStudentAnswer(studentId: number, examId: number, subjectId: number, data: { ultimate: number, comment: string } ) {
      return this.post("/submit/result", {  studentId: studentId, examId: examId , subjectId: subjectId, ultimate: data.ultimate, comment: data.comment });
    }

    public async submitStudentExamSuccess(studentId: number, examId: number) {
      return this.put("/successful", { studentId: studentId, examId: examId })
    }
}

export default new exam();