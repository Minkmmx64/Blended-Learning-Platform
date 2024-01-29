import { StuClassProps } from "../../store/useAppUserRedux";
import { Request, RequestData } from "../env.";

export interface StuCourseProps {
  id: number;
  remark: string;
  name: string;
  code: string;
  avatar: string;
}

export interface StuTeacherProps {
  id: number;
  remark: string;
  name: string;
  code: string;
  authentication: string;
  profile: string;
  gender: string;
  age: number;
}

export interface CourseTables {
  id: number;
  datejsonarray: string;
  teacher_id: number;
  class_id: number;
  course_id: number;
  class: StuClassProps;
  course: StuCourseProps;
  teacher: StuTeacherProps;
}

export interface ChapterResources {
  cover:        string;
  create_time:  string;
  id:           number;
  name:         string;
  remark:       string;
  src:          string;
  type:         string;
  update_time:  string;
}

export class Class extends Request {
  constructor() {
    super("/app");
  }

  //根据班级加载我的课程表
  public async getStudentCourseTables(classId: number): Promise<RequestData<CourseTables[]>> {
    return this.get(`/class/student/${classId}`);
  }

  //根据章节Id加载章节资源
  public async getChapterResource(chapterId: number): Promise<RequestData<ChapterResources[]>> {
    return this.get(`/chapter/resource/${chapterId}`);
  }
}

export default new Class();