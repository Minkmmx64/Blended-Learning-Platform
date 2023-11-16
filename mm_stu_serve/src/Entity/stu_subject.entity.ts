import { Column, Entity } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";

@Entity("mm_stu_stu_subject")
export class StuSubject extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "题目描述"})
  describe: string;

  @Column({type: "enum", enum: ["单选题","多选题","简答题","判断题"], comment: "题目类型"})
  type: "单选题" | "多选题" | "简答题" | "判断题";

  @Column({type: "char", length: 255, comment: "答案"})
  result: string;

  @Column({type: "char", length: 255, comment: "选项", nullable: true})
  options: string;

}