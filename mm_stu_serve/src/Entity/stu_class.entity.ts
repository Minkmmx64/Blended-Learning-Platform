import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuCollege } from './stu_college.entity';
import { ClassCourseTeacher } from './teacher_course_class.entity';

@Entity("mm_stu_stu_class") //班级表
export class StuClass extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "班级名称"})
  name: string;

  //班级属于哪个学院
  @ManyToOne( type => StuCollege, college => college.classes, { nullable : false })  
  college: StuCollege;

  //一个班级有多张课程表
  @OneToMany(() => ClassCourseTeacher, (cct) => cct.course)
  classCourseTeachers: ClassCourseTeacher[];
}
