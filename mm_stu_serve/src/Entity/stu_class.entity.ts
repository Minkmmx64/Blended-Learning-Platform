import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuCollege } from './stu_college.entity';
import { ClassCourseTeacher } from './relation_teacher_course_class.entity';
import { StuInfo } from './stu_info.entity';

@Entity("mm_stu_stu_class") //班级表
export class StuClass extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "班级名称"})
  name: string;

  //班级属于哪个学院
  @ManyToOne( type => StuCollege, college => college.classes, { nullable : false })  
  college: StuCollege;

  //一个班级有多张课程表
  @OneToMany( type => ClassCourseTeacher, ClassCourseTeacher => ClassCourseTeacher.course)
  classCourseTeachers: ClassCourseTeacher[];

  //一个班级对应多个学生
  @OneToMany(type => StuInfo,StuInfo => StuInfo.id)
  students: StuInfo[];
}
