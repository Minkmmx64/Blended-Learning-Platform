import { Injectable } from "@nestjs/common";
import { StuChapter } from "src/Entity/stu_chapter.entity";
import { StuCourse } from "src/Entity/stu_course.entity";
import { StuCourseResource } from "src/Entity/stu_course_resource.entity";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";
import { ChapterService } from "src/Modules/admin/chapter/chapter.service";
import { ClassService } from "src/Modules/admin/class/class.service";
import { CourseService } from "src/Modules/admin/course/course.service";
import { resourceService } from "src/Modules/admin/resource/resource.service";
import { ServiceData } from "src/Modules/index.type";

@Injectable()
export class IndexService{
  constructor(
    private readonly ChapterService: ChapterService,
    private readonly CourseService: CourseService,
    private readonly ClassService: ClassService,
    private readonly resourceService: resourceService,
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
}