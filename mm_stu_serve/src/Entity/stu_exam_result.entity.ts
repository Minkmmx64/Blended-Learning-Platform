import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuExam } from "./stu_exam.entity";
import { StuSubject } from "./stu_subject.entity";
import { StuInfo } from "./stu_info.entity";

@Entity("mm_stu_stu_exam_result")
@Unique(["exam", "student", "subject"])
export class StuExamResult extends BaseAttrColumn {

  @Column({ type: "mediumtext", comment: "学生答案"})
  result: string;

  @Column({ type: "mediumtext", comment: "教师评语", nullable: true})
  teacher_comment: string;

  @Column({ type: "int", comment: "最终得分", nullable: true})
  ultimate: number;

  // 学生答题结果是对于 某次考试id 中的 某个题目
  @ManyToOne(type => StuExam, StuExam => StuExam.id) // #ok
  @JoinColumn({ name: "exam"})
  exam: StuExam;

  @ManyToOne(type => StuInfo, StuInfo => StuInfo.id)
  @JoinColumn({ name: "student", referencedColumnName: "id"})
  student: StuInfo;
  
  @ManyToOne(type => StuSubject, StuSubject => StuSubject.id)
  @JoinColumn({ name: "subject"})
  subject: StuSubject;
}