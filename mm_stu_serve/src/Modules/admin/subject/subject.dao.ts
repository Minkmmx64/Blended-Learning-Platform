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

    return await SelectQueryBuilder
                                   .orderBy(SubjectQuery.prop, Order)
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
                                
                             }).execute();
    return result;
  }

  public async UpdateSubjectById(UpdateSubject: SubjectUpdateDTO): Promise<UpdateResult> {

    const result = await this.SubjectRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                            
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
