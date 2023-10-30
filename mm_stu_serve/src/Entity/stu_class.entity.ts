import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuCollege } from './stu_college.entity';

@Entity("mm_stu_stu_class") //班级表
export class StuClass extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "班级名称"})
  name: string;

  //班级属于哪个学院
  @ManyToOne( type => StuCollege, college => college.classes )  
  college: StuCollege;
}
