import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuSubject } from "./stu_subject.entity";
import { StuExam } from "./stu_exam.entity";

@Entity("mm_stu_stu_paper")
export class StuPaper extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "试卷名称"})
  name: string;

  @Column({type: "int", comment: "总分"})
  total: number;

  @ManyToMany(type => StuSubject, StuSubject => StuSubject.id)
  @JoinTable({
    name: "mm_stu_paper_subject"
  })
  subjects: StuSubject[];

  @OneToMany( type => StuExam, StuExam => StuExam.id)
  exames: StuExam[];
  
}