import { Column, Entity, OneToMany } from "typeorm";
import { BaseAttrColumn } from "../BaseAttrColumn";
import { ShopEntity } from "./shop";

@Entity({ database: "mm_wx", name: "classify"})
export class ClassifyEntity extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "分类名称"})
  name : string;

  @Column({ type: "char", length: 255, comment: "分类封面" })
  avatar: string;

  @OneToMany( type => ShopEntity, shop => shop.id)
  shops: ShopEntity[]
}