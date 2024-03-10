import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuClass } from './stu_class.entity';
import { AppUser } from './app_user.entity';
import { StuSign } from './stu_sign.entity';
import { StuExam } from './stu_exam.entity';

//学生学籍表
@Entity("mm_stu_stu_info")
export class StuInfo extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "学号", primary: true, unique: true })
  student: string;

  @Column({ type: "char", length: 255, comment : "学校名称" })
  school: string;

  @Column({ type: "char", length: 255, comment : "学生姓名" })
  name: string;

  @Column({ type: "char", length: 255, comment : "籍贯" })
  native: string

  @Column({ type: "int", width: 10, comment : "入学年份" })
  year: number;

  @Column({ type: "enum", enum: ["男", "女"], comment : "性别" })
  gender: "男" | "女";

  @Column({ type: "int", width: 4, comment : "年龄" })
  age: number;

  @Column({ type: "char", length: 255, comment: "学籍照片"})
  avatar: string;

  @OneToOne(type => AppUser, { nullable: true }) // #ok
  @JoinColumn({ name: "app_user_id" })
  user: AppUser;

  //学生班级属于一个学院的某个班级
  @ManyToOne( type => StuClass , { nullable : false }) // #ok
  @JoinColumn({ name: "class_id" })
  class: StuClass;

  @OneToMany( type => StuSign, StuSign => StuSign.id) // #ok
  signs: StuSign[];

  @OneToMany(type => StuExam, StuExam => StuExam.id) // #ok
  exames: StuExam[];
}