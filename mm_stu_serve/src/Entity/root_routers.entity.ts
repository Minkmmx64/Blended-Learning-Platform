import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { RootRole } from "./root_role.entity";


@Entity("mm_stu_root_routers")
export class RootRouters extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "路由名称"})
  name: string;

  @Column({ type: "char", length: 255, comment: "路由key关键字"})
  key: string;

  @ManyToMany( type => RootRole, RootRole => RootRole.id)
  roles: RootRole[];

  @Column({ type: "int", comment: "父路由Id", nullable: true})
  @ManyToOne(type => RootRouters, RootRouters => RootRouters.id)
  @JoinColumn({
    name: "pid"
  })
  pid: number;
}