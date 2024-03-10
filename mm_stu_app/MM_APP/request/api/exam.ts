import { StuClassProps } from "../../store/useAppUserRedux";
import { Request, RequestData } from "../env.";
import { StuCourseProps, StuTeacherProps } from "./class";

export interface Exam {
	id: number;
	create_time: string;
	update_time: string;
	status: boolean;
	remark?: string;
	name: string;
	time: string;
	course: StuCourseProps;
	class: StuClassProps;
	teacher: StuTeacherProps;
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

export class exam extends Request {
  constructor(){
    super("/app/exam");
  }

  //加载学生作业列表
  public async getExamLists(data: { studentId: number, courseId?: number }) : Promise<RequestData<StuExamProps[]>> {
    return this.get("/lists", data);
  }
}

export default new exam();