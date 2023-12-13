import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ClassCreateDTO, ClassQueryDTO, ClassUpdateDTO, UpdateClassTableDTO } from "./class.dto";
import { StuClass } from "src/Entity/stu_class.entity";
import { ToOrder } from "src/common/common";
import { ClassCourseTeacher } from "src/Entity/teacher_course_class.entity";

export class ClassDAO {
  constructor(protected DataSource: DataSource){}

  public ClassRepository = this.DataSource.getRepository(StuClass);

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

  public async UpdateClassTable(class_table_id: number, Body: UpdateClassTableDTO) : Promise<ClassCourseTeacher | InsertResult> {
    const find = await this.ClassCourseTeacherRepository
                           .createQueryBuilder()
                           .select()
                           .where("teacher_id = :teacher_id")
                           .setParameter("teacher_id", Body.teacher_id)
                           .andWhere("course_id = :course_id")
                           .setParameter("course_id", Body.course_id)
                           .andWhere("class_id = :class_id")
                           .setParameter("class_id", Body.class_id)
                           .getOne();
    if(find) {
      find.datejsonarray = Body.json;
      return await this.ClassCourseTeacherRepository.save(find);
    } else {
      return await this.ClassCourseTeacherRepository
                       .createQueryBuilder()
                       .insert()
                       .values({
                         class_id: Body.class_id,
                         course_id: Body.course_id,
                         teacher_id: Body.teacher_id,
                         datejsonarray: Body.json
                       })
                       .execute();
    }
  }
  
}