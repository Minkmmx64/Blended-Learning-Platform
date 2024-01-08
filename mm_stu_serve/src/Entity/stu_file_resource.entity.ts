import { Column, Entity } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";

@Entity("mm_stu_file_resource")
export class StuFileResource extends BaseAttrColumn {
  
  @Column({type: "char", length: 255, comment: "文件唯一md5", unique: true})
  md5: string;

  @Column({type:"char", length:255, comment: "文件路径"})
  src: string;

  @Column({type: "char", length: 255, comment:"文件类型" })
  type: string;
}