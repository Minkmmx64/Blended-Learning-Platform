import { StuClassProps } from "../../store/useAppUserRedux";
import { Request, RequestData } from "../env.";
import { StuCourseProps, StuTeacherProps } from "./class";

export interface Exam {
	id: number;
	name: string;
	time: string;
	course: StuCourseProps;
	class: StuClassProps;
	teacher: StuTeacherProps;
  paper: StuPaperProps;
}

export interface StuPaperProps {
	id: number;
	name: string;
	total: number;
	classify: string;
}

export enum ExamStatus {
  uncommitted = "未提交",
  waiting = "等待阅卷",
  successful = "批改完成"
}

export interface StuExamProps {
	id: number;
	grades: number;
	exam_status: ExamStatus;
	exam: Exam;
}

export interface StuSubjectProps {
	id: number;
	describe: string;
	type: SubjectType;
	options: string;
	points: number;
	classify: string;
}

export enum SubjectType {
  Signal = "单选题",
  Multiple = "多选题",
  Profile = "简答题",
  Judge = "判断题"
}

export class exam extends Request {
  constructor(){
    super("/app/exam");
  }

  //加载学生作业列表
  public async getExamLists(data: { studentId: number, courseId?: number }) : Promise<RequestData<StuExamProps[]>> {
    return this.get("/lists", data);
  }

  //加载试卷id
  public async getExamById(examId: number) : Promise<RequestData<Exam>> {
    return this.get(`/${examId}`);
  }

  //加载试卷题目
  public async getPaperSubjectsByPaperId(paperId: number) : Promise<RequestData<StuSubjectProps[]>> {
    return this.get(`/paper/${paperId}`);
  }
}

export default new exam();