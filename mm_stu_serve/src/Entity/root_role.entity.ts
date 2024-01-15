import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { RootUser } from './root_user.entity';
import { RootRouters } from './root_routers.entity';

@Entity("mm_stu_root_role")
export class RootRole extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "角色名称"})
  name: string;

  @OneToMany(() => RootUser, user => user.id)
  users: RootUser[];

  @ManyToMany(type => RootRouters, RootRouters => RootRouters.id)
  @JoinTable({
    name: "relation_mm_stu_role_router",
    joinColumn: {
      referencedColumnName: "id",
      name: "role_id"
    },
    inverseJoinColumn: {
      referencedColumnName: "id",
      name: "router_id"
    }
  })
  routers: RootRouters[];
}