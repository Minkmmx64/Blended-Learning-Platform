import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuChapter } from "./stu_chapter.entity";

@Entity("mm_stu_course_resource")
export class StuCourseResource extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment:"资源路径"})
  src: string;

  @Column({type: "char", length: 255, comment:"资源封面", nullable: true})
  cover: string;

  @Column({type: "char", length: 255, comment:"资源名称"})
  name: string;
 
  @Column({type: "char", length: 255, comment:"资源类型"})
  type: string;

  @ManyToOne( type => StuChapter, StuChapter => StuChapter.id)
  @JoinColumn({
    name: "chapter_id"
  })
  chapter: StuChapter;
}
