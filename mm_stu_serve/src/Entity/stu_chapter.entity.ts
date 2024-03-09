import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuCourseResource } from "./stu_course_resource.entity";
import { StuCourse } from "./stu_course.entity";


@Entity("mm_stu_stu_chapter")
export class StuChapter extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment: "章节名称"})
  name: string;

  @Column({type: "char", length: 255, comment: "封面", nullable: true})
  cover: string;

  @Column({type: "int", comment: "父章节id", nullable: true})
  @ManyToOne( type => StuChapter, StuChapter => StuChapter.id) // #ok
  @JoinColumn({
    name: "pid"
  })
  pid: number;

  @OneToMany( type => StuCourseResource, StuCourseResource => StuCourseResource.id) // #ok
  resources: StuCourseResource[];
  
  @Column({type: "int", comment: "课程id", nullable: true}) // #ok
  @ManyToOne( type => StuCourse, StuCourse => StuCourse.id)
  @JoinColumn({
    name: "course"
  })
  course: StuCourse;
}