import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuInfo } from "./stu_info.entity";
import { StuExam } from "./stu_exam.entity";

export enum ExamStatus {
  uncommitted = "未提交",
  waiting = "等待阅卷",
  successful = "批改完成"
}

@Entity("relation_mm_stu_user_exam")
export class UserExam extends BaseAttrColumn {

  @Column({ type: "int", comment: "总分", default: 0})
  grades: number;

  @Column({ type: "enum", enum: [ExamStatus.successful, ExamStatus.uncommitted, ExamStatus.waiting], comment: "考试状态", default: ExamStatus.uncommitted })
  exam_status: ExamStatus;

  @ManyToOne(type => StuInfo, StuInfo => StuInfo.id)
  @JoinColumn({
    name: "student",
    referencedColumnName: "id"
  })
  student: StuInfo;

  @ManyToOne(type => StuExam, StuExam => StuExam.id)
  @JoinColumn({
    name: "exam",
    referencedColumnName: "id"
  })
  exam: StuExam;
}