import { Check, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuInfo } from "./stu_info.entity";
import { StuTeacher } from "./stu_teacer.entity";
@Entity("mm_stu_app_user")
@Check(
  `(
    ("type" = 'student' AND "student_code" IS NOT NULL AND "teacher_code" IS NULL) 
    OR 
    ("type" = 'teacher' AND "teacher_code" IS NOT NULL AND "student_code" IS NULL)
  )
  AND
  ("teacher_code IS NOT NULL AND "student_code" IS NOT NULL)
`)
export class AppUser extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "用户名"})
  username: string;

  @Column({type: "char", length: 255, comment: "密码"})
  password: string;

  @Column({type: "char", length: 255, comment: "头像", nullable: true})
  avatar: string;

  @Column({type: "char", length: 255, comment: "标签", nullable: true})
  label: string;

  @Column({type: "char", length: 255, comment: "手机号" })
  phone: string;
  
  @Column({ type: 'enum', enum: ['student', 'teacher'], comment: "用户类型" })
  type: 'student' | 'teacher';

  @OneToOne(type => StuInfo, { nullable: true }) // #ok
  @JoinColumn({ name: "student_code", referencedColumnName: "student"})
  student: StuInfo;

  @OneToOne(type => StuTeacher, { nullable: true }) // #ok
  @JoinColumn({ name:"teacher_code",  referencedColumnName: "code" })
  teacher: StuTeacher;
}