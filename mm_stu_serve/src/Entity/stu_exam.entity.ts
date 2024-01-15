import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { AppUser } from "./app_user.entity";
import { StuPaper } from "./stu_paper.entity";

@Entity("mm_stu_stu_exam")
export class StuExam extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment: "考试名称"})
  name: string;

  @Column({type: "int", comment: "考试时长"})
  time: number;

  @ManyToMany(type => AppUser, AppUser => AppUser.id)
  users: AppUser[]

  @ManyToOne( type => StuPaper, StuPaper => StuPaper.id)
  paper: StuPaper;
}