import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { TeacherCreateDTO, TeacherQueryDTO, TeacherUpdateDTO } from "./teacher.dto";
import { ToOrder } from "src/common/common";
import { StuTeacher } from "src/Entity/stu_teacer.entity";

export class TeacherDAO {
  constructor(protected DataSource: DataSource){}

  public TeacherRepository = this.DataSource.getRepository(StuTeacher);

  public async TeacherListsPagination(TeacherQuery: PaginationQuery<TeacherQueryDTO>): Promise<StuTeacher[]> {

    const Order = ToOrder(TeacherQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuTeacher> = this.TeacherRepository.createQueryBuilder().select();

    if(TeacherQuery.name) {
      SelectQueryBuilder
                        .andWhere("name LIKE :name")
                        .setParameter("name", `%${TeacherQuery.name}%`);
    }

    return await SelectQueryBuilder
                                   .orderBy(TeacherQuery.prop, Order)
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



  public async Total() : Promise<number> {
    return await this.TeacherRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
