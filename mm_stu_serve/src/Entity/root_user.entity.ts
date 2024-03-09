import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseAttrColumn } from './BaseAttrColumn';
import { RootRole } from './root_role.entity';
import { StuTeacher } from './stu_teacer.entity';

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

  @Column({ type: "char", length: 255, comment: "头像", nullable: true })
  avatar: string;

  @OneToOne(type => StuTeacher, { nullable : true}) // #ok
  @JoinColumn({
    name: "teacher_id"
  })
  teacher: StuTeacher;

  @ManyToOne( type => RootRole, role => role.users, { nullable : false }) // 管理员需要有权限 // #ok
  role: RootRole;
}