import { StuInfo } from "src/Entity/stu_info.entity";
import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { StuCreateDTO, StuQueryDTO, StuUpdateDTO } from "./stu.dto";
import { ToOrder } from "src/common/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StuDAO {
  constructor(protected DataSource: DataSource){}

  public StuRepository = this.DataSource.getRepository(StuInfo);

  public async StuListsPagination(StuQuery: PaginationQuery<StuQueryDTO>): Promise<StuInfo[]> {

    const Order = ToOrder(StuQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuInfo> = this.StuRepository.createQueryBuilder("stu").leftJoinAndSelect("stu.class", "mm_stu_stu_class");

    if(StuQuery.class_id) {
      SelectQueryBuilder
                        .andWhere("stu.class_id = :class_id")
                        .setParameter("class_id", StuQuery.class_id)
    }

    if(StuQuery.name) {
      SelectQueryBuilder
                        .where("stu.name LIKE :name")
                        .setParameter("name", `%${StuQuery.name}%`);
    }

    return await SelectQueryBuilder
                                   .orderBy(StuQuery.prop, Order)
                                   .skip(StuQuery.limit * (StuQuery.offset - 1))
                                   .take(StuQuery.limit)
                                   .getMany();
  }

  public async CreateStu(CreateStu: StuCreateDTO): Promise<InsertResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuInfo)
                             .values({
                                remark: CreateStu.remark,
                                student: CreateStu.student,
                                school: CreateStu.school ?? "浙江理工大学科技与艺术学院",
                                name: CreateStu.name,
                                age: CreateStu.age,
                                avatar: CreateStu.avatar,
                                year: CreateStu.year,
                                class: {
                                  id: CreateStu.class_id
                                },
                                gender: CreateStu.gender,
                                native: CreateStu.native
                             })
                             .execute();
    return result;
  }

  public async UpdateStuById(UpdateStu: StuUpdateDTO): Promise<UpdateResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                remark: UpdateStu.data.remark,
                                student: UpdateStu.data.student,
                                school: UpdateStu.data.school,
                                name: UpdateStu.data.name,
                                age: UpdateStu.data.age,
                                avatar: UpdateStu.data.avatar,
                                year: UpdateStu.data.year,
                                class: {
                                  id: UpdateStu.data.class_id
                                },
                                gender: UpdateStu.data.gender,
                                native: UpdateStu.data.native
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateStu.id)
                             .execute();
    return result;
  }

  public async DeleteStuById(id: number) : Promise<DeleteResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async getStudentsByClassId(class_id: number) : Promise<StuInfo[]> {
    const result = await this.StuRepository.createQueryBuilder()
                                           .select()
                                           .where("class_id = :id")
                                           .setParameter("id", class_id)
                                           .getMany();
    return result;
  }

  public async Total() : Promise<number> {
    return await this.StuRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  public async getStudentByCode(student: string) : Promise<StuInfo> {
    return await this.StuRepository
                     .createQueryBuilder()
                     .select()
                     .where("student = :student")
                     .setParameter("student", student)
                     .getOne();
  }

  public async getStudentInfoClass(classId: number) : Promise<StuInfo[]> {
    return await this.StuRepository
                     .createQueryBuilder("student")
                     .leftJoinAndSelect("student.user", "app")
                     .where("class_id = :classId")
                     .setParameter("classId", classId)
                     .getMany();
  }

  public async getStudentById(student_id: number) : Promise<StuInfo> {
    return await this.StuRepository
                     .createQueryBuilder("student")
                     .leftJoinAndSelect("student.class", "class")
                     .where("student.id = :student_id")
                     .setParameter("student_id", student_id)
                     .getOne();
  }
}
