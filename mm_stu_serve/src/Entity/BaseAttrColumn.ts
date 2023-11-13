import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseAttrColumn {

  @PrimaryGeneratedColumn({ comment: "id" })
  id: number;

  @CreateDateColumn({ type: "timestamp", comment: "创建时间" })
  create_time: Date;

  @UpdateDateColumn({ type: "timestamp", comment: "修改时间" })
  update_time: Date;

  @Column({ type: "bool", comment: "状态", default: true})
  status: boolean;
}