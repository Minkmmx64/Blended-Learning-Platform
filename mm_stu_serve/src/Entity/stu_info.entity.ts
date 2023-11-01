import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuCollege } from './stu_college.entity';
import { StuClass } from './stu_class.entity';

//学生学籍表
@Entity("mm_stu_stu_info")
export class StuInfo extends BaseAttrColumn {

  @PrimaryColumn({ type: "char", length: 20, comment: "学号" })
  sno: number;

  @Column({ type: "char", length: 20, comment : "学校名称" })
  school: string;

  @Column({ type: "char", length: 20, comment : "学生姓名" })
  name: string;

  @Column({ type: "char", length: 20, comment : "籍贯" })
  native: string

  @Column({ type: "int", width: 4, comment : "入学年份" })
  year: number;

  //学生属于一个学院
  @ManyToOne( type => StuCollege , { nullable: false })
  college: StuCollege;

  //学生班级属于一个学院的某个班级
  @ManyToOne( type => StuClass , { nullable : false })
  class: StuClass;
}