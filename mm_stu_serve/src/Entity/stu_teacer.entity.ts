import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { StuCourse } from "./stu_course.entity";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { ClassCourseTeacher } from "./teacher_course_class.entity";


@Entity("mm_stu_stu_teacher")
export class StuTeacher extends BaseAttrColumn {

  @Column({type: "char", length: 20, comment: "教师姓名"})
  name: string;

  @ManyToMany(type => StuCourse, StuCourse => StuCourse.teachers, { cascade: true })
  @JoinTable({
    name: "mm_stu_teacher_course",
    joinColumn: {
      name: "teacher_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "course_id",
      referencedColumnName: "id"
    }
  })
  courses: StuCourse[]

  @OneToMany(() => ClassCourseTeacher, (ClassCourseTeacher) => ClassCourseTeacher.teacher)
  classCourseTeachers: ClassCourseTeacher[];
}