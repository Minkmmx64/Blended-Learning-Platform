import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { Sign, SignCreateDTO, SignQueryDTO, SignUpdateDTO } from "./sign.dto";
import { ToOrder } from "src/common/common";
import { StuSign } from "src/Entity/stu_sign.entity";
import * as moment from "moment";
import { UserSign } from "src/Entity/relation_user_sign.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SignDAO {
  constructor(protected DataSource: DataSource){}

  public SignRepository = this.DataSource.getRepository(StuSign);

  public UserSignRepository = this.DataSource.getRepository(UserSign);

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
                                type: CreateSign.SignType,
                                cipher: CreateSign.SignType === Sign.Gestures ? CreateSign.SignCipher : '',
                                class: { id: CreateSign.classId },
                                course: { id: CreateSign.courseId },
                                teacher: { id: CreateSign.teacherId },
                                start: moment(now).format("YYYY-MM-DD HH:mm:ss"),
                                end: moment(end).format("YYYY-MM-DD HH:mm:ss")
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

  // 添加签到关联记录
  public async addUserSignRecord(student_id: number[], sign_id: number) {
    
    return await this.UserSignRepository
                     .createQueryBuilder()
                     .insert()
                     .values(
                       student_id.map( id => {
                         return {
                           successful: false,
                           sign: { id: sign_id },
                           student: { id: id }
                         }
                       })
                     )
                     .execute();
  }

  public async getStudentSignInfo(signId: number, studentId: number) : Promise<UserSign>{

    return await this.UserSignRepository
                     .createQueryBuilder()
                     .select()
                     .where("student = :studentId")
                     .setParameter("studentId", studentId)
                     .andWhere("sign_id = :signId")
                     .setParameter("signId", signId)
                     .getOne();
  }

  public async getStuSignBySutdentId(studentId: number) : Promise<UserSign[]> {
    return await this.UserSignRepository
                     .createQueryBuilder("real_sign")
                     .leftJoinAndSelect("real_sign.sign", "sign")
                     .leftJoinAndSelect("sign.course", "course")
                     .leftJoinAndSelect("sign.teacher", "teacher")
                     .where("real_sign.student = :studentId")
                     .setParameter("studentId", studentId)
                     .orderBy("real_sign.create_time", "DESC")
                     .getMany();
  }

  //学生进行签到
  public async toggleStudentInitSign(studentId: number, signId: number) : Promise<UpdateResult> {
    return await this.UserSignRepository
                     .createQueryBuilder()
                     .update()
                     .set({
                      successful: true
                     })
                     .where("sign_id = :signId")
                     .setParameter("signId", signId)
                     .andWhere("student = :studentId")
                     .setParameter("studentId", studentId)
                     .execute();
  }

  public async getSignInfoBySignId(signId: number) : Promise<StuSign> {
    return await this.SignRepository
                     .createQueryBuilder("sign")
                     .leftJoinAndSelect("sign.class", "class")
                     .leftJoinAndSelect("sign.course", "course")
                     .leftJoinAndSelect("sign.teacher", "teacher")
                     .select()
                     .where("sign.id = :signId")
                     .setParameter("signId", signId)
                     .getOne();
  }

  public async getStudentInitSign(studentId: number, signId: number) : Promise<UserSign> {
    return await this.UserSignRepository
                     .createQueryBuilder()
                     .select()
                     .where("sign_id = :signId")
                     .setParameter("signId", signId)
                     .andWhere("student = :studentId")
                     .setParameter("studentId", studentId)
                     .getOne();
  }
}
