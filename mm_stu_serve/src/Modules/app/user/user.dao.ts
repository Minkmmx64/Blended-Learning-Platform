import { Injectable } from "@nestjs/common";
import { AppUser } from "src/Entity/app_user.entity";
import { DataSource, InsertResult } from "typeorm";
import { RegisterData } from "./user.dto";
import { StuTeacher } from "src/Entity/stu_teacer.entity";
import { StuInfo } from "src/Entity/stu_info.entity";


@Injectable()
export class AppUserDAO {

  constructor(
    protected DataSource: DataSource
    ){}

  public AppUserRepository = this.DataSource.getRepository(AppUser);

  public async getAppUserByUserName(username: string) :Promise<AppUser> {
    return await this.AppUserRepository
                     .createQueryBuilder()
                     .select()
                     .where("username = :username")
                     .setParameter("username", username)
                     .getOne();
  }

  public async getAppUserByPhone(phone: string) :Promise<AppUser> {
    return await this.AppUserRepository
                     .createQueryBuilder()
                     .select()
                     .where("phone = :phone")
                     .setParameter("phone", phone)
                     .getOne();
  }

  public async getAppUserCode(code: string, type: "student" | "teacher") :Promise<AppUser> {
    const QueryBuilder = this.AppUserRepository
                             .createQueryBuilder()
                             .select()
    if(type === "student") {
      QueryBuilder
                  .where("student_code = :student_code")
                  .setParameter("student_code", code)
    } else {
      QueryBuilder
                  .where("teacher_code = :teacher_code")
                  .setParameter("teacher_code", code)
    }
    
    return await QueryBuilder.getOne();
  }

  public async getAppUserByTeacher(username: string) : Promise<AppUser> {
    return await this.AppUserRepository
                     .createQueryBuilder("user")
                     .leftJoinAndSelect("user.teacher", "mm_stu_stu_teacher.code")
                     .where("username = :username")
                     .setParameter("username", username)
                     .getOne();
  }

  public async getAppUserByStudent(username: string) : Promise<AppUser> {
    return await this.AppUserRepository
                     .createQueryBuilder("user")
                     .leftJoinAndSelect("user.student", "mm_stu_stu_info.student")
                     .where("username = :username")
                     .setParameter("username", username)
                     .getOne();
  }
  
  public async insertAppUser(insert: RegisterData, auth : StuTeacher | StuInfo) : Promise<InsertResult> {

    return await this.AppUserRepository
                     .createQueryBuilder()
                     .insert()
                     .values({
                      username: insert.username,
                      password: insert.password,
                      phone: insert.phone,
                      type: insert.type,
                      [insert.type]: auth
                     })
                     .execute();
  }
}