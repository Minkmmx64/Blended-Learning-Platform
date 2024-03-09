import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuChapter } from "./stu_chapter.entity";

@Entity("mm_stu_course_resource")
export class StuCourseResource extends BaseAttrColumn {
  @Column({type: "char", length: 255, comment:"资源路径", nullable: true})
  src: string;

  @Column({type: "char", length: 255, comment:"资源封面", nullable: true})
  cover: string;

  @Column({type: "char", length: 255, comment:"资源名称"})
  name: string;
 
  //支持 zip, doc, ppt, mp4(音视频)
  @Column({type: "char", length: 255, comment:"资源类型", nullable: true })
  type: string;

  @ManyToOne( type => StuChapter, StuChapter => StuChapter.id) // #ok
  @JoinColumn({
    name: "chapter_id"
  })
  chapter: StuChapter;
}
