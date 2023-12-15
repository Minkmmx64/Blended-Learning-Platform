
import { Module } from "@nestjs/common";
import { WXClientController } from "./wxclient.controller";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyDAO } from "../classify/classify.dao";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { ShopDAO } from "../shop/shop.dao";
import { ShopService } from "../shop/shop.service";
import { ShopEntity } from "src/Entity/wx/shop";


@Module({
  imports: [
    TypeOrmModule.forFeature([ClassifyEntity, ShopEntity], 'WXConnection')
  ],
  providers: [ ClassifyService, ClassifyDAO, ShopDAO, ShopService ],
  controllers: [WXClientController]
})
export class WXClientModule {

}
