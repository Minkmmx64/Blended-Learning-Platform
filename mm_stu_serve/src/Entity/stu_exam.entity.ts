import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuPaper } from "./stu_paper.entity";
import { StuInfo } from "./stu_info.entity";
import { StuExamResult } from "./stu_exam_result.entity";
import { StuCourse } from "./stu_course.entity";
import { StuClass } from "./stu_class.entity";
import { StuTeacher } from "./stu_teacer.entity";
import { UserExam } from "./relation_mm_stu_user_exam.entity";

@Entity("mm_stu_stu_exam")
export class StuExam extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment: "考试名称"})
  name: string;

  @Column({type: "timestamp", comment: "结束日期"})
  time: Date;

  @ManyToOne( type => StuPaper, StuPaper => StuPaper.id) // #ok
  paper: StuPaper;

  @OneToMany(type => StuInfo, StuInfo => StuInfo.id) // #ok
  students: StuInfo[]

  // 这场考试有多个答案
  @OneToMany(type => StuExamResult, StuExamResult => StuExamResult.id) // #ok
  results: StuExamResult[];

  //属于哪门课程
  @ManyToOne(type => StuCourse, StuCourse => StuCourse.id)
  @JoinColumn({ name: "courseId"})
  course: StuCourse;

  //属于哪个班级
  @ManyToOne(type => StuClass, StuClass => StuClass.id)
  @JoinColumn({ name: "classId"})
  class: StuClass;

  //属于哪个教师发布
  @ManyToOne(type => StuTeacher, StuTeacher => StuTeacher.id)
  @JoinColumn({ name: "teacherId"})
  teacher: StuTeacher;

  //哪些同学参加了考试
  @OneToMany(type => UserExam, UserExam => UserExam.exam)
  userexams: UserExam[];
}