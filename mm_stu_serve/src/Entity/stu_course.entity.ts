import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuTeacher } from "./stu_teacer.entity";
import { ClassCourseTeacher } from "./teacher_course_class.entity";
import { StuChapter } from "./stu_chapter.entity";
import { StuCollege } from "./stu_college.entity";

@Entity("mm_stu_stu_course")
export class StuCourse extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "课程名称"})
  name: string;

  @Column({type: "char", length: 255, comment: "课程封面"})
  avatar: string;

  @ManyToMany(type => StuTeacher, StuTeacher => StuTeacher.courses)
  teachers: StuTeacher[]

  @OneToMany(() => ClassCourseTeacher, (ClassCourseTeacher) => ClassCourseTeacher.course)
  classCourseTeachers: ClassCourseTeacher[];

  @OneToMany( type => StuChapter, StuChapter => StuChapter.id)
  chapters: StuChapter[];

  @ManyToOne( type => StuCollege, StuCollege => StuCollege.id)
  @JoinColumn({ name: "college_id" })
  college: StuCollege;
}