import { Request } from "../env.";

export interface Chapters {
  id: number;
  create_time: string;
  update_time: string;
  status: boolean,
  remark: string;
  name: string;
  cover: string;
  pid: null | number;
  course: number;
  children?: Chapters[];
}

export class Index extends Request {
  constructor() {
    super("/app/index");
  }

  //加载首页课程
  public async loadCourse(offset: number, limit: number) {
    return this.get("/course/list", { offset, date: Date.now(), limit });
  }

  //加载章节
  public async getChaptersByCourseId(courseId: number): Promise<{ data: Chapters[] }> {
    return this.get(`/chapter/${ courseId }`);
  }

  //根据班级加载我的课程表
  public async getStudentCourseTables() {
    
  }
}

export default new Index();