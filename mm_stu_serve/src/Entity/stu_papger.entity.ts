import { Column, Entity } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";

@Entity("mm_stu_stu_paper")
export class StuPaper extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "试卷名称"})
  name: string;

  @Column({type: "int", comment: "总分"})
  total: number;
  
}