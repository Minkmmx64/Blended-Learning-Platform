
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../index.type";
import { CourseDAO } from "./course.dao";
import { CourseCreateDTO, CourseUpdateDTO, CourseQueryDTO } from "./course.dto";
import { StuCourse } from "src/Entity/stu_course.entity";

@Injectable()
export class CourseService{
  constructor(private readonly DataSource: DataSource){}

  public CourseDAO = new CourseDAO(this.DataSource); 

  public async CourseListsPagination(CourseQuery: PaginationQuery<CourseQueryDTO>): ServiceData<ListMetaData<StuCourse[]>> {
    try {
      const Courses = await this.CourseDAO.CourseListsPagination(CourseQuery);
      const res: ListMetaData<StuCourse[]> = {
        list: Courses,
        meta: {
          total: await this.CourseDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async CourseCreate(CourseCreate: CourseCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.CourseDAO.CreateCourse(CourseCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async CourseUpdate(CourseUpdate : CourseUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.CourseDAO.UpdateCourseById(CourseUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async CourseDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.CourseDAO.DeleteCourseById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}