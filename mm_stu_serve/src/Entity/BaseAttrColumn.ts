import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export class BaseAttrColumn {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", comment: "创建时间" })
  create_time: Date;

  @Column({ type: "date", comment: "修改时间" })
  update_time: Date;
}