import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { RealCourseDTO, TeacherCreateDTO, TeacherQueryDTO, TeacherUpdateDTO } from "./teacher.dto";
import { ToOrder } from "src/common/common";
import { StuTeacher } from "src/Entity/stu_teacer.entity";
import { StuCourse } from "src/Entity/stu_course.entity";

export class TeacherDAO {
  constructor(protected DataSource: DataSource){}

  public TeacherRepository = this.DataSource.getRepository(StuTeacher);

  public async TeacherListsPagination(TeacherQuery: PaginationQuery<TeacherQueryDTO>): Promise<StuTeacher[]> {

    const Order = ToOrder(TeacherQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuTeacher> = this.TeacherRepository.createQueryBuilder("teacher").leftJoinAndSelect("teacher.courses", "mm_stu_stu_course");

    if(TeacherQuery.name) {
      SelectQueryBuilder
                        .andWhere("teacher.name LIKE :name")
                        .setParameter("name", `%${TeacherQuery.name}%`);
    }

    if(TeacherQuery.authentication) {
      SelectQueryBuilder
                        .andWhere("teacher.authentication = :authentication")
                        .setParameter("authentication", TeacherQuery.authentication);
    }

    if(TeacherQuery.prop) {
      SelectQueryBuilder
                        .orderBy("teacher." + TeacherQuery.prop, Order)
    }

    return await SelectQueryBuilder
                                   .skip(TeacherQuery.limit * (TeacherQuery.offset - 1))
                                   .take(TeacherQuery.limit)
                                   .getMany();
  }

  public async CreateTeacher(CreateTeacher: TeacherCreateDTO): Promise<InsertResult> {

    const result = await this.TeacherRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuTeacher)
                             .values({
                                name: CreateTeacher.name,
                                age: CreateTeacher.age,
                                gender: CreateTeacher.gender,
                                profile: CreateTeacher.profile,
                                remark: CreateTeacher.remark,
                                code: CreateTeacher.code
                             }).execute();
    return result;
  }

  public async UpdateTeacherById(UpdateTeacher: TeacherUpdateDTO): Promise<UpdateResult> {

    const result = await this.TeacherRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                name: UpdateTeacher.data.name,
                                age: UpdateTeacher.data.age,
                                gender: UpdateTeacher.data.gender,
                                profile: UpdateTeacher.data.profile,
                                remark: UpdateTeacher.data.remark,
                                code: UpdateTeacher.data.code
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateTeacher.id)
                             .execute();
    return result;
  }

  public async DeleteTeacherById(id: number) : Promise<DeleteResult> {

    const result = await this.TeacherRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async RealCourse(RealCourse: RealCourseDTO) : Promise<void> {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 先加载之前的课程
      const data = await this.TeacherRepository
                             .createQueryBuilder(null, queryRunner)
                             .relation(StuTeacher, "courses")
                             .of(RealCourse.id)
                             .loadMany<StuCourse>();
      // 删除之前的课程
      await this.TeacherRepository
                .createQueryBuilder(null, queryRunner)
                .relation(StuTeacher, "courses")
                .of(RealCourse.id)
                .remove(data);
      // 重新添加教师课程关系
      await this.TeacherRepository
                .createQueryBuilder(null, queryRunner)
                .relation(StuTeacher, "courses")
                .of(RealCourse.id)
                .add(RealCourse.course);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async Total() : Promise<number> {
    return await this.TeacherRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
