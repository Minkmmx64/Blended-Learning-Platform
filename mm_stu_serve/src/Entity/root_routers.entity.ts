import { Column, Entity, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";


@Entity("mm_stu_root_routers")
export class RootRouters extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "路由名称"})
  name: string;

  @Column({ type: "char", length: 255, comment: "路由key关键字"})
  key: string;

  @Column({ type: "int", comment: "父路由Id", nullable: true})
  @ManyToOne(type => RootRouters, RootRouters => RootRouters.id)
  pid: number;
}