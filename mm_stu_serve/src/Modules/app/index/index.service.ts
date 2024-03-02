import { Injectable } from "@nestjs/common";
import { UserSign } from "src/Entity/relation_user_sign.entity";
import { StuChapter } from "src/Entity/stu_chapter.entity";
import { StuCourse } from "src/Entity/stu_course.entity";
import { StuCourseResource } from "src/Entity/stu_course_resource.entity";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";
import { ChapterService } from "src/Modules/admin/chapter/chapter.service";
import { ClassService } from "src/Modules/admin/class/class.service";
import { CourseService } from "src/Modules/admin/course/course.service";
import { resourceService } from "src/Modules/admin/resource/resource.service";
import { SignDAO } from "src/Modules/admin/sign/sign.dao";
import { ServiceData } from "src/Modules/index.type";
import { StudentInitSign, studentVeriftSign } from "./index.dto";
import { RedisService } from "src/Modules/redis/RedisService";

@Injectable()
export class IndexService{
  constructor(
    private readonly ChapterService: ChapterService,
    private readonly CourseService: CourseService,
    private readonly ClassService: ClassService,
    private readonly resourceService: resourceService,
    private readonly SignDAO : SignDAO,
    private readonly RedisService: RedisService
  ){}

  public async IndexCourseLists(offset: number, limit: number) : ServiceData<StuCourse[]> {
    try {
      const courses = await this.CourseService.CourseDAO.LoadIndexCourses(offset, limit);
      return [ null, courses ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async getChaptersByCourseId(courseId: number) : ServiceData<StuChapter[]> {
    try {
      const [ error, chapters ] = await this.ChapterService.getChapterByCourseId(courseId);
      return [ error, chapters ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async getStudentCourseTables(classId: number) : ServiceData<ClassCourseTeacher[]> {
    try {
      const tables = await this.ClassService.ClassDAO.getStudentCourseTablesByClassId(classId);
      return [ null, tables ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }
  
  public async getChapterResource(chapterId: number) : ServiceData<StuCourseResource[]> {
    try {
      const resources = await this.resourceService.resourceDAO.getChapterResourceByChapterId(chapterId);
      return [ null, resources ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async getStuSignBySutdentId(studentId: number) : ServiceData<UserSign[]> {
    try {
      const signs = await this.SignDAO.getStuSignBySutdentId(studentId);
      return [ null, signs ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async studentInitSign(signData: StudentInitSign) : ServiceData<{ ok: number , msg: string }> {
    try {
      const { signId, studentId } = signData;
      const sign = await this.SignDAO.getSignInfoBySignId(signId);

      const key = `${sign.teacher.id}-${sign.class.id}-${sign.course.id}`;
      const ttl = await this.RedisService.getTTL(key);

      //获取学生签到信息
      const signInit = await this.SignDAO.getStudentInitSign(studentId, signId);
        if(signInit.successful) {
          return [ null , { ok: 0, msg: "请勿重复签到" } ];
        }
      if(ttl > 0) {
        //签到没过期，进行签到
        await this.SignDAO.toggleStudentInitSign(studentId, signId);
        return [ null , { ok: 1, msg: "签到成功" } ];
      } else {
        return [ null , { ok: -1 , msg: "签到过期" } ];
      }
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async studentVeriftSign(verift: studentVeriftSign) : ServiceData<{ ok: number , msg: string }> {
    try {
      const sign = await this.SignDAO.getSignInfoBySignId(verift.signId);
      if(sign.cipher === verift.cipher){
        return [ null , { ok: 1, msg: "手势正确" } ];
      } else return [ null , { ok: -1 , msg: "手势错误" } ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }
}