import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseAttrColumn } from "../BaseAttrColumn";
import { ClassifyEntity } from "./classify";

@Entity({ database: "mm_wx", name: "shop" })
export class ShopEntity extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "商品名称" })
  name: string;

  @Column({ type: "char", length: 255, comment: "商品封面" })
  avatar: string;

  @Column({ type: "float", comment: "商品价格" })
  prices: number;

  @Column({ type: "int", comment: "商品库存" })
  stock: number;

  @Column({ type: "char", length: 255,  comment: "商品详情",  nullable: true, default: "[]" })
  detail: string;

  @ManyToOne( type => ClassifyEntity, classify => classify.id, { nullable: false})
  @JoinColumn({
    name: "classify_id"
  })
  classify: ClassifyEntity;
}