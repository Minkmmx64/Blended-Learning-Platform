import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { CourseCreateDTO, CourseQueryDTO, CourseUpdateDTO } from "./course.dto";
import { ToOrder } from "src/common/common";
import { StuCourse } from "src/Entity/stu_course.entity";

export class CourseDAO {
  constructor(protected DataSource: DataSource){}

  public CourseRepository = this.DataSource.getRepository(StuCourse);

  public async CourseListsPagination(CourseQuery: PaginationQuery<CourseQueryDTO>): Promise<StuCourse[]> {

    const Order = ToOrder(CourseQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuCourse> = this.CourseRepository.createQueryBuilder("course").leftJoinAndSelect("course.college", "mm_stu_stu_college");

    if(CourseQuery.name) {
      SelectQueryBuilder
                        .andWhere("course.name LIKE :name")
                        .setParameter("name", `%${CourseQuery.name}%`)
    }

    if(CourseQuery.college_id) {
      SelectQueryBuilder
                        .andWhere("course.college_id = :college_id")
                        .setParameter("college_id", CourseQuery.college_id)
    }

    if(CourseQuery.prop) {
      SelectQueryBuilder
                                   .orderBy("course." + CourseQuery.prop, Order)
    }

    return await SelectQueryBuilder
                                   .skip(CourseQuery.limit * (CourseQuery.offset - 1))
                                   .take(CourseQuery.limit)
                                   .getMany();
  }

  public async CreateCourse(CreateCourse: CourseCreateDTO): Promise<InsertResult> {

    const result = await this.CourseRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuCourse)
                             .values({
                                name: CreateCourse.name,
                                avatar: CreateCourse.avatar,
                                remark: CreateCourse.remark,
                                college: {
                                  id: CreateCourse.college_id
                                }
                             }).execute();
    return result;
  }

  public async UpdateCourseById(UpdateCourse: CourseUpdateDTO): Promise<UpdateResult> {

    const result = await this.CourseRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              name: UpdateCourse.data.name,
                              remark: UpdateCourse.data.remark,
                              avatar: UpdateCourse.data.avatar,
                              college: {
                                id: UpdateCourse.data.college_id
                              }
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateCourse.id)
                             .execute();
    return result;
  }

  public async DeleteCourseById(id: number) : Promise<DeleteResult> {

    const result = await this.CourseRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async CourseAll(){
    return await this.CourseRepository
                     .createQueryBuilder()
                     .select()
                     .getMany();
  }

  public async Total() : Promise<number> {
    return await this.CourseRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  //加载首页课程
  public async LoadIndexCourses(offset: number, limit: number) : Promise<StuCourse[]> {
    const SelectQueryBuilder: SelectQueryBuilder<StuCourse> = this.CourseRepository.createQueryBuilder("course").leftJoinAndSelect("course.college", "mm_stu_stu_college");
    return await SelectQueryBuilder
                                  .skip((offset - 1) * limit)
                                  .take(limit)
                                  .getMany();
  }
}
