import { Injectable } from "@nestjs/common";
import { StuChapter } from "src/Entity/stu_chapter.entity";
import { StuCourse } from "src/Entity/stu_course.entity";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";
import { ChapterService } from "src/Modules/admin/chapter/chapter.service";
import { ClassService } from "src/Modules/admin/class/class.service";
import { CourseService } from "src/Modules/admin/course/course.service";
import { ServiceData } from "src/Modules/index.type";

@Injectable()
export class IndexService{
  constructor(
    private readonly ChapterService: ChapterService,
    private readonly CourseService: CourseService,
    private readonly ClassService: ClassService
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
      const tables = await this.ClassService.ClassDAO.getStudentCourseTables(classId);
      return [ null, tables ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }
  
}