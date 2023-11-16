import { Entity, ManyToOne, JoinColumn, Column, Unique, OneToMany } from 'typeorm';
import { StuClass } from './stu_class.entity';
import { StuCourse } from './stu_course.entity';
import { StuTeacher } from './stu_teacer.entity';
import { BaseAttrColumn } from './BaseAttrColumn';
import { StuSign } from './stu_sign.entity';

@Entity("mm_stu_class_course_teacher")
@Unique(["class_id","course_id","teacher_id"])
export class ClassCourseTeacher extends BaseAttrColumn {
  @Column({type: "mediumtext", comment: "上课时间"})
  datejsonarray: string;

  @Column()
  teacher_id: number;

  @Column()
  class_id: number;

  @Column()
  course_id: number;

  @OneToMany(() => StuSign, StuSign => StuSign.id)
  signs: StuSign[];

  @ManyToOne(() => StuClass, (StuClass) => StuClass.classCourseTeachers)
  @JoinColumn({ name: 'class_id' })
  class: StuClass;

  @ManyToOne(() => StuCourse, (StuCourse) => StuCourse.classCourseTeachers)
  @JoinColumn({ name: 'course_id' })
  course: StuCourse;

  @ManyToOne(() => StuTeacher, (StuTeacher) => StuTeacher.classCourseTeachers)
  @JoinColumn({ name: 'teacher_id' })
  teacher: StuTeacher;

}