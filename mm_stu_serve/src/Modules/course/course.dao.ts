import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { CourseCreateDTO, CourseQueryDTO, CourseUpdateDTO } from "./course.dto";
import { ToOrder } from "src/common/common";
import { StuCourse } from "src/Entity/stu_course.entity";

export class CourseDAO {
  constructor(protected DataSource: DataSource){}

  public CourseRepository = this.DataSource.getRepository(StuCourse);

  public async CourseListsPagination(CourseQuery: PaginationQuery<CourseQueryDTO>): Promise<StuCourse[]> {

    const Order = ToOrder(CourseQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuCourse> = this.CourseRepository.createQueryBuilder().select();

    if(CourseQuery.name) {
      SelectQueryBuilder
                        .andWhere("name LIKE :name")
                        .setParameter("name", `%${CourseQuery.name}%`)
    }

    return await SelectQueryBuilder
                                   .orderBy(CourseQuery.prop, Order)
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
                                remark: CreateCourse.remark
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
                              avatar: UpdateCourse.data.avatar
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



  public async Total() : Promise<number> {
    return await this.CourseRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
