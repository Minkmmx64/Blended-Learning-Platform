import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { SubjectCreateDTO, SubjectQueryDTO, SubjectUpdateDTO } from "./subject.dto";
import { ToOrder } from "src/common/common";
import { StuSubject } from "src/Entity/stu_subject.entity";

export class SubjectDAO {
  constructor(protected DataSource: DataSource){}

  public SubjectRepository = this.DataSource.getRepository(StuSubject);

  public async SubjectListsPagination(SubjectQuery: PaginationQuery<SubjectQueryDTO>): Promise<StuSubject[]> {

    const Order = ToOrder(SubjectQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuSubject> = this.SubjectRepository.createQueryBuilder().select();

    if(SubjectQuery.prop) {
      SelectQueryBuilder
                        .orderBy(SubjectQuery.prop, Order)
    }

    if(SubjectQuery.classify) {
      SelectQueryBuilder
                        .andWhere("classify LIKE :classify")
                        .setParameter("classify", `%${SubjectQuery.classify}%`);
    }

    if(SubjectQuery.describe) {
      SelectQueryBuilder
                        .andWhere("describe LIKE :describe")
                        .setParameter("describe", `%${SubjectQuery.describe}%`);
    }

    if(SubjectQuery.type) {
      SelectQueryBuilder
                        .andWhere("type = :type")
                        .setParameter("type", SubjectQuery.type);
    }

    return await SelectQueryBuilder
                                   .skip(SubjectQuery.limit * (SubjectQuery.offset - 1))
                                   .take(SubjectQuery.limit)
                                   .getMany();
  }

  public async CreateSubject(CreateSubject: SubjectCreateDTO): Promise<InsertResult> {

    const result = await this.SubjectRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuSubject)
                             .values({
                                remark: CreateSubject.remark,
                                classify: CreateSubject.classify,
                                options: JSON.stringify(CreateSubject.options),
                                result: CreateSubject.result,
                                type: CreateSubject.type,
                                describe: CreateSubject.describe,
                                points: CreateSubject.points ?? 2
                             }).execute();
    return result;
  }

  public async UpdateSubjectById(UpdateSubject: SubjectUpdateDTO): Promise<UpdateResult> {

    const result = await this.SubjectRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                remark: UpdateSubject.data.remark,
                                classify: UpdateSubject.data.classify,
                                options: JSON.stringify(UpdateSubject.data.options),
                                result: UpdateSubject.data.result,
                                type: UpdateSubject.data.type,
                                describe: UpdateSubject.data.describe,
                                points: UpdateSubject.data.points
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateSubject.id)
                             .execute();
    return result;
  }

  public async DeleteSubjectById(id: number) : Promise<DeleteResult> {

    const result = await this.SubjectRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.SubjectRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
