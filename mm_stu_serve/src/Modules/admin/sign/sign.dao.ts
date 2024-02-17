import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { Sign, SignCreateDTO, SignQueryDTO, SignUpdateDTO } from "./sign.dto";
import { ToOrder } from "src/common/common";
import { StuSign } from "src/Entity/stu_sign.entity";
import * as moment from "moment";

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
    const now = Date.now();
    const end = now + CreateSign.SignDuration * 60 * 1000;
    const result = await this.SignRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuSign)
                             .values({
                                name: CreateSign.SignTitle,
                                type: CreateSign.signType,
                                cipher: CreateSign.signType === Sign.Gestures ? CreateSign.SignCipher : '',
                                class: { id: CreateSign.classId },
                                course: { id: CreateSign.courseId },
                                teacher: { id: CreateSign.teacherId },
                                start: moment(now).format("YYYY-MM-DD hh:mm:ss"),
                                end: moment(end).format("YYYY-MM-DD hh:mm:ss")
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
