import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuInfo } from "./stu_info.entity";
import { StuSign } from "./stu_sign.entity";

@Entity("relation_mm_stu_user_sign")
export class UserSign extends BaseAttrColumn {

  @Column({ type:"bool", default: false, comment: "签到状态" })
  successful: boolean;

  @ManyToOne(type => StuInfo, StuInfo => StuInfo.id) // #ok
  @JoinColumn({
    name: "student",
    referencedColumnName: "id"
  })
  student: StuInfo;

  @ManyToOne(type => StuSign, StuSign => StuSign.id) // #ok
  @JoinColumn({
    name: "sign_id",
    referencedColumnName: "id"
  })
  sign: StuSign;
}