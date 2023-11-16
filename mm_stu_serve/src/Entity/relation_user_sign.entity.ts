import { Column, Entity, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { AppUser } from "./app_user.entity";
import { ClassCourseTeacher } from "./teacher_course_class.entity";

@Entity("relation_mm_stu_user_sign")
export class UserSign extends BaseAttrColumn {

  @Column({ type:"bool", default: false, comment: "签到状态" })
  successful: boolean;

  @ManyToOne(type => AppUser, AppUser => AppUser.student)
  user: AppUser;

  @ManyToOne(type => ClassCourseTeacher, ClassCourseTeacher => ClassCourseTeacher.id)
  classcourseteacher: ClassCourseTeacher;
}