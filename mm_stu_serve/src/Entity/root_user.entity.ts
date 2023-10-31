import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { RootRole } from './root_role.entity';

@Entity("mm_stu_root_user")
export class RootUser extends BaseAttrColumn {

  @Column({ type: "char", length: 20, comment: "用户名"})
  username: string;

  @Column({ type: "char", length: 255, comment: "密码"})
  password: string;

  @Column({ type: "char", length: 255, comment: "手机号"})
  phone: string;

  @Column({ type: "char", length: 255, comment: "标签", nullable: true})
  label: string;

  @Column({ type: "char", comment: "头像", nullable: true })
  avatar: string;

  @ManyToOne( type => RootRole, role => role.users )
  role: RootRole;
}