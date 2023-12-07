import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuClass } from './stu_class.entity';

@Entity("mm_stu_stu_college") // 学院表
export class StuCollege extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "学院名称"})
  name: string;

  @Column({ type: "char", length: 20, comment: "学院编码", unique: true })
  code: string;

  //学院有哪些班级
  @OneToMany( type => StuClass, StuClass => StuClass.id)  
  classes: StuClass[];
}