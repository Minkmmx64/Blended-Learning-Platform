import { Injectable } from "@nestjs/common";
import { LoginData, RegisterData } from "./user.dto";
import { ServiceData } from "src/Modules/index.type";
import { AppUserDAO } from "./user.dao";
import { DataSource, InsertResult } from "typeorm";
import { encryption, uncryption } from "src/utils/crypto";
import { TeacherDAO } from "src/Modules/admin/teacher/teacher.dao";
import { StuDAO } from "src/Modules/admin/stu/stu.dao";
import { StuInfo } from "src/Entity/stu_info.entity";
import { StuTeacher } from "src/Entity/stu_teacer.entity";

@Injectable()
export class AppUserService {

  constructor(
    private readonly DataSource: DataSource,
    private readonly TeacherDAO: TeacherDAO,
    private readonly StuDAO: StuDAO,
  ) { }

  public AppUserDAO = new AppUserDAO(this.DataSource);

  public async AppUserRegist(regist: RegisterData): ServiceData<InsertResult> {
    try {
      const user = await this.AppUserDAO.getAppUserByUserName(regist.username);
      const phone = await this.AppUserDAO.getAppUserByPhone(regist.phone);
      const code = regist.type === "student" ? regist.student_code : regist.teacher_code;
      const auth = await this.AppUserDAO.getAppUserCode(code, regist.type);

      if (user) throw "用户名重复";
      if (phone) throw "手机号重复";
      if (auth) throw "该学生/教师已被认证";

      let findAuth: StuTeacher | StuInfo;
      if (regist.type === "teacher") {
        findAuth = await this.TeacherDAO.getTeacherByCode(regist.teacher_code);
      } else findAuth = await this.StuDAO.getStudentByCode(regist.student_code);
      if (findAuth === null) throw "学号/职工号不存在";
      regist.password = encryption(regist.password);
      const result = await this.AppUserDAO.insertAppUser(regist, findAuth);
      return [null, result];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async AppUserLogin(login: LoginData): ServiceData<any> {
    try {
      // 通过 username 查找用户
      const user = await this.AppUserDAO.getAppUserByUserName(login.username);
      if (user) {
        const { password, type, username } = user;

        if (uncryption(password) !== login.password) throw "密码错误";
        // 根据 type 获取用户身份
        if(type === "teacher") {
          return [ null, await this.AppUserDAO.getAppUserByTeacher(username) ];
        } else {
          return [ null, await this.AppUserDAO.getAppUserByStudent(username) ];
        }
      }
      throw "用户不存在";
    } catch (error) {
      return [new Error(error), null];
    }
  }
}