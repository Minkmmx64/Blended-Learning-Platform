import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuTeacher } from "./stu_teacer.entity";
import { UserSign } from "./relation_user_sign.entity";
import { StuCourse } from "./stu_course.entity";
import { StuClass } from "./stu_class.entity";

enum Sign {
  Gestures = "手势签到",
  QRcode = "二维码签到",
  Online = "在线签到"
}

@Entity("mm_stu_stu_sign")
//@Unique(["classId","courseId","teacherId"])
export class StuSign extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "签到名称"})
  name: string;

  @Column({type: "enum", enum: ["手势签到", "二维码签到", "在线签到"], comment: "签到类型"})
  type: Sign;

  @Column({type: "char", length: 20, comment: "签到密钥", nullable: true})
  cipher: string;

  @Column({type: "date", comment: "开始时间"})
  start: string;

  @Column({type: "date", comment: "结束时间", nullable: true})
  end: string;

  @ManyToOne(type => StuClass, StuClass => StuClass.id)
  //@JoinColumn({ name: "class_id"})
  class: StuClass;

  @ManyToOne(type => StuCourse, StuCourse => StuCourse.id)
  //@JoinColumn({ name: "course_id"})
  course: StuCourse;

  @ManyToOne(type => StuTeacher, StuTeacher => StuTeacher.id)
  //@JoinColumn({ name: "teacher_id"})
  teacher: StuTeacher;

  @OneToMany(type => UserSign, UserSign => UserSign.id)
  users: UserSign[];

}