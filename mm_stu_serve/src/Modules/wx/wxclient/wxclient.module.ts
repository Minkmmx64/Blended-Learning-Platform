
import { Module } from "@nestjs/common";
import { WXClientController } from "./wxclient.controller";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyDAO } from "../classify/classify.dao";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { ShopDAO } from "../shop/shop.dao";
import { ShopService } from "../shop/shop.service";
import { ShopEntity } from "src/Entity/wx/shop";
import { OrderService } from "../order/order.service";
import { OrderDAO } from "../order/order.dao";
import { OrderEntity } from "src/Entity/wx/order";


@Module({
  imports: [
    TypeOrmModule.forFeature([ClassifyEntity, ShopEntity, OrderEntity], 'WXConnection')
  ],
  providers: [ ClassifyService, ClassifyDAO, ShopDAO, ShopService, OrderService, OrderDAO ],
  controllers: [WXClientController]
})
export class WXClientModule {

}
