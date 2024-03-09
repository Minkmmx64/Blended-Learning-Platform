import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { StuCourse } from "./stu_course.entity";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { ClassCourseTeacher } from "./teacher_course_class.entity";
import { StuSign } from "./stu_sign.entity";
import { StuPaper } from "./stu_paper.entity";
import { AppUser } from "./app_user.entity";
import { RootUser } from "./root_user.entity";

@Entity("mm_stu_stu_teacher")
export class StuTeacher extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "教师姓名"})
  name: string;

  //学校代码13280 + 姓名缩写 + 随机4位数字
  @Column({type: "char", length: 255, comment: "职工号",  unique: true})
  code: string;

  @Column({type: "enum", enum: ["已认证", "待认证"], comment: "认证状态", default: "待认证"})
  authentication: "已认证" | "待认证";

  @Column({type: "char", length: 255, comment: "教师简介"})
  profile: string;

  @Column({ type: "enum", enum: ["男", "女"], comment : "性别" })
  gender: "男" | "女";

  @Column({ type: "int", width: 4, comment : "年龄" })
  age: number;

  // @OneToOne(type => AppUser, { nullable: true }) // #ok
  // @JoinColumn({ name: "app_user_id" })
  // user: AppUser;

  @OneToMany(type => StuSign, StuSign => StuSign.teacher) // #ok
  signs: StuSign[];

  @ManyToMany(type => StuCourse, StuCourse => StuCourse.teachers) // #ok
  @JoinTable({
    name: "relation_mm_stu_teacher_course",
    joinColumn: {
      name: "teacher_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "course_id",
      referencedColumnName: "id"
    }
  })
  courses: StuCourse[]

  @OneToMany(() => ClassCourseTeacher, (ClassCourseTeacher) => ClassCourseTeacher.teacher) // #ok
  classCourseTeachers: ClassCourseTeacher[];

  @OneToMany(() => StuPaper, StuPaper => StuPaper.id) // #ok
  papers: StuPaper[];

  @OneToOne(type => RootUser, RootUser => RootUser.id, { nullable : true}) // #ok
  root: RootUser;
}