import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseAttrColumn } from "../BaseAttrColumn";
import { ShopEntity } from "./shop";

@Entity({name: "order", database: "mm_wx"})
export class OrderEntity extends BaseAttrColumn {

  @Column({ type: "char", length: 255, comment: "订单流水号", unique: true })
  Serial: string;

  @Column({ type: "int", comment: "购买数量"})
  count: number;

  @Column({ type: "float", comment: "实际支付"})
  payment: number;

  @Column({ type: "enum", enum: ["待支付", "已支付", "待付款"], comment: "订单状态"})
  pay_status: string;

  @Column({ type: "char", length: 255, comment: "用户openId"})
  openid: string;

  @ManyToOne(type => ShopEntity, shop => shop.id)
  @JoinColumn({ name: "shop_id" })
  shop: ShopEntity;
}