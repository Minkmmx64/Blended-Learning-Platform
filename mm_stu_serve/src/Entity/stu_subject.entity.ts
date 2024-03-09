import { Column, Entity, ManyToMany } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuPaper } from "./stu_paper.entity";

@Entity("mm_stu_stu_subject")
export class StuSubject extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "题目描述"})
  describe: string;

  @Column({type: "enum", enum: ["单选题","多选题","简答题","判断题"], comment: "题目类型"})
  type: "单选题" | "多选题" | "简答题" | "判断题";

  @Column({type: "mediumtext", comment: "参考答案"})
  result: string;

  @Column({type: "char", length: 255, comment: "选项", nullable: true})
  options: string;

  @ManyToMany(type => StuPaper, StuPaper => StuPaper.id) // #ok
  papers: StuPaper[];

  //题目分类
  @Column({ type: "char", length: 255, comment: "题目分类" })
  classify: string;
}