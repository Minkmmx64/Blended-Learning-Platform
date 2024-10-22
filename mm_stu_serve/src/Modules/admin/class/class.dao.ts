import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ClassCreateDTO, ClassQueryDTO, ClassUpdateDTO, UpdateClassTableDTO } from "./class.dto";
import { StuClass } from "src/Entity/stu_class.entity";
import { ToOrder } from "src/common/common";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ClassDAO {
  constructor(protected DataSource: DataSource){}

  public ClassRepository = this.DataSource.getRepository(StuClass);

  public ClassTableRepositiry = this.DataSource.getRepository(ClassCourseTeacher);

  public ClassCourseTeacherRepository = this.DataSource.getRepository(ClassCourseTeacher);

  public async ClassListsPagination(ClassQuery: PaginationQuery<ClassQueryDTO>): Promise<StuClass[]> {

    const Order = ToOrder(ClassQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuClass> = this.ClassRepository.createQueryBuilder("class").leftJoinAndSelect("class.college", "mm_stu_stu_college");

    if(ClassQuery.name) {
      SelectQueryBuilder
                        .where("class.name LIKE :name")
                        .setParameter("name", `%${ClassQuery.name}%`);
    }

    if(ClassQuery.prop) {
      SelectQueryBuilder
                        .orderBy(`class.${ClassQuery.prop}`, Order)
    }

    return await SelectQueryBuilder
                                   .skip(ClassQuery.limit * (ClassQuery.offset - 1))
                                   .take(ClassQuery.limit)
                                   .getMany();
  }

  public async CreateClass(CreateClass: ClassCreateDTO): Promise<InsertResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuClass)
                             .values({
                                name: CreateClass.name,
                                college: {
                                  id: CreateClass.college_id
                                },
                                remark: CreateClass.remark,
                                code: CreateClass.code
                             }).execute();
    return result;
  }

  public async UpdateClassById(UpdateClass: ClassUpdateDTO): Promise<UpdateResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              college: {
                                id: UpdateClass.data.college_id
                              },
                              name: UpdateClass.data.name,
                              remark: UpdateClass.data.remark,
                              code: UpdateClass.data.code
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateClass.id)
                             .execute();
    return result;
  }

  public async DeleteClassById(id: number) : Promise<DeleteResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async ClassAll(){
    return await this.ClassRepository
                     .createQueryBuilder("class")
                     .leftJoinAndSelect("class.college", "mm_stu_stu_college")
                     .getMany();
  }

  public async getStuCollegeClassById(id: number): Promise<StuClass> {
    const result = await this.ClassRepository.createQueryBuilder("class")
                                             .leftJoinAndSelect("class.college", "mm_stu_stu_college")
                                             .where("class.id = :id")
                                             .setParameter("id", id)
                                             .getOne();
    return result
  }

  public async ClassTable(class_id: number): Promise<ClassCourseTeacher[]> {
    return await this.ClassCourseTeacherRepository
                     .createQueryBuilder("ClassCourseTeacher")
                     .leftJoinAndSelect("ClassCourseTeacher.course", "mm_stu_stu_course")
                     .leftJoinAndSelect("ClassCourseTeacher.teacher", "mm_stu_stu_teacher")
                     .leftJoinAndSelect("ClassCourseTeacher.class", "mm_stu_stu_class")
                     .where("ClassCourseTeacher.class_id = :class_id")
                     .setParameter("class_id", class_id)
                     .getMany();
  }

  public async Total() : Promise<number> {
    return await this.ClassRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  public async UpdateClassTable(class_id: number, Body: UpdateClassTableDTO) : Promise<void> {
   // 先删除该班级的所有课程表
   //console.log(Body);

   const queryRunner = this.DataSource.createQueryRunner();
   try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await this.ClassCourseTeacherRepository
              .createQueryBuilder(null, queryRunner)
              .delete()
              .where("class_id = :class_id")
              .setParameter("class_id", class_id)
              .execute();
    for(let i = 0; i < Body.list.length; i ++) {
      const object = Body.list[i];
      await this.ClassCourseTeacherRepository
                .createQueryBuilder(null, queryRunner)
                .insert()
                .values({
                  class_id: class_id,
                  teacher_id: object.teacher_id,
                  datejsonarray: object.json,
                  course_id: object.course_id
                })
                .execute();
    }
    await queryRunner.commitTransaction();
    return void 0;
   } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new Error(error);
   } finally {
    await queryRunner.release();
   }
  }

  public async getStudentCourseTablesByClassId(classId: number) {
    return await this.ClassTableRepositiry
                     .createQueryBuilder("table")
                     .leftJoinAndSelect("table.class", "mm_stu_stu_class")
                     .leftJoinAndSelect("table.course", "mm_stu_stu_course")
                     .leftJoinAndSelect("table.teacher", "mm_stu_stu_teacher")
                     .where("table.class_id = :classId")
                     .setParameter("classId", classId)
                     .getMany();
  }

  public async getStudentCourseTablesByTeacherId(teacherId: number) {
    return await this.ClassTableRepositiry
                     .createQueryBuilder("table")
                     .leftJoinAndSelect("table.class", "mm_stu_stu_class")
                     .leftJoinAndSelect("table.course", "mm_stu_stu_course")
                     .leftJoinAndSelect("table.teacher", "mm_stu_stu_teacher")
                     .where("table.teacher_id = :teacherId")
                     .setParameter("teacherId", teacherId)
                     .getMany();
  }
  
  public async getTeacherClassGroup(teacherId: number) {
    
    const data = await this.ClassTableRepositiry
                           .createQueryBuilder("cct")
                           .leftJoinAndSelect("cct.class", "class")
                           .groupBy("cct.class_id")
                           .select([ "cct.id" ])
                           .addSelect(["class.name", "class.id"])
                           .where("cct.teacher_id = :teacherId", { teacherId })
                           .getMany();
    const ret = await Promise.all(data.map( async ( value ) => {
      const find_course = (await this.ClassTableRepositiry
                                     .createQueryBuilder("cct")
                                     .leftJoinAndSelect("cct.course", "course")
                                     .where("cct.class_id = :classId", { classId: value.class.id })
                                     .andWhere("cct.teacher_id = :teacherId", { teacherId })
                                     .select(["cct.id"])
                                     .addSelect(["course.id", "course.name"])
                                     .getMany())
                                     .map( v => { return { ...v.course, key: v.course.id } });
      return {
        ...value,
        ... {
          class: {
            ...value.class,
            courses: find_course,
            key: value.class.id
          }
        }
      }
    }));
    return ret;
  }
}