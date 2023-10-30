import { Entity, Column, OneToMany } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { RootUser } from './root_user.entity';

@Entity("mm_stu_root_role")
export class RootRole extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "角色名称"})
  name: string;

  @Column({ type: "char", length: 20, comment: "权限表"})
  routers: string;

  @OneToMany(() => RootUser, user => user.id)
  users: RootUser[];
}