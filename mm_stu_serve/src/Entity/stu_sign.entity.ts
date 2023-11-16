import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuTeacher } from "./stu_teacer.entity";
import { ClassCourseTeacher } from "./relation_teacher_course_class.entity";
import { UserSign } from "./relation_user_sign.entity";

enum TypeEnum {
  hand = "手势签到",
  code = "二维码签到"
}

@Entity("mm_stu_stu_sign")
export class StuSign extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "签到名称"})
  name: string;

  @Column({type: "enum", enum: ["手势签到", "二维码签到"], comment: "签到类型"})
  type: TypeEnum;

  @Column({type: "char", length: 20, comment: "签到密钥"})
  cipher: string;

  @Column({type: "date", comment: "开始时间"})
  start: string;

  @Column({type: "date", comment: "结束时间", nullable: true})
  end: string;

  @ManyToOne(type => ClassCourseTeacher, ClassCourseTeacher => ClassCourseTeacher.id)
  classcourseteacher: ClassCourseTeacher;

  @ManyToOne(type => StuTeacher, StuTeacher => StuTeacher.id)
  teacher: StuTeacher;

  @OneToMany(type => UserSign, UserSign => UserSign.id)
  users: UserSign[];

}