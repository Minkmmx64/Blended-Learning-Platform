import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { SignCreateDTO, SignQueryDTO, SignUpdateDTO } from "./sign.dto";
import { ToOrder } from "src/common/common";
import { StuSign } from "src/Entity/stu_sign.entity";

export class SignDAO {
  constructor(protected DataSource: DataSource){}

  public SignRepository = this.DataSource.getRepository(StuSign);

  public async SignListsPagination(SignQuery: PaginationQuery<SignQueryDTO>): Promise<StuSign[]> {

    const Order = ToOrder(SignQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuSign> = this.SignRepository.createQueryBuilder().select();

    return await SelectQueryBuilder
                                   .orderBy(SignQuery.prop, Order)
                                   .skip(SignQuery.limit * (SignQuery.offset - 1))
                                   .take(SignQuery.limit)
                                   .getMany();
  }

  public async CreateSign(CreateSign: SignCreateDTO): Promise<InsertResult> {

    const result = await this.SignRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuSign)
                             .values({
                                
                             }).execute();
    return result;
  }

  public async UpdateSignById(UpdateSign: SignUpdateDTO): Promise<UpdateResult> {

    const result = await this.SignRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                            
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateSign.id)
                             .execute();
    return result;
  }

  public async DeleteSignById(id: number) : Promise<DeleteResult> {

    const result = await this.SignRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.SignRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
