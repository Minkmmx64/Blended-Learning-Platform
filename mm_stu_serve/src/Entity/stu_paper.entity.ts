import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuSubject } from "./stu_subject.entity";
import { StuExam } from "./stu_exam.entity";
import { StuTeacher } from "./stu_teacer.entity";

@Entity("mm_stu_stu_paper")
export class StuPaper extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "试卷名称"})
  name: string;

  @Column({type: "int", comment: "总分"})
  total: number;

  @ManyToMany(type => StuSubject, StuSubject => StuSubject.id) // #ok
  @JoinTable({
    name: "relation_mm_stu_paper_subject",
    joinColumn: {
      referencedColumnName: "id",
      name: "paper_id"
    },
    inverseJoinColumn: {
      referencedColumnName: "id",
      name: "subject_id"
    }
  })
  subjects: StuSubject[];

  //题目分类
  @Column({ type: "char", length: 255, comment: "试卷分类" })
  classify: string;

  @OneToMany( type => StuExam, StuExam => StuExam.id) // #ok
  exames: StuExam[];

  @ManyToOne(type => StuTeacher, StuTeacher => StuTeacher.id) // #ok
  @JoinColumn({ name: "teacher_id" })
  teacher: StuTeacher;
}