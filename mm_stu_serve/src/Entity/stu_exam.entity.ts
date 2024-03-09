import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuPaper } from "./stu_paper.entity";
import { StuInfo } from "./stu_info.entity";

@Entity("mm_stu_stu_exam")
export class StuExam extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment: "考试名称"})
  name: string;

  @Column({type: "int", comment: "考试时长"})
  time: number;

  @ManyToMany(type => StuInfo, StuInfo => StuInfo.id) // #ok
  students: StuInfo[]

  @ManyToOne( type => StuPaper, StuPaper => StuPaper.id) // #ok
  paper: StuPaper;
}