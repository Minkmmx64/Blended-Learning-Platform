import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { ShopDAO } from "./shop.dao";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShopEntity } from "src/Entity/wx/shop";


@Module({
  imports: [
    TypeOrmModule.forFeature([ShopEntity], 'WXConnection')
  ],
  providers: [ShopService, ShopDAO],
  controllers: [ShopController],
})
export class ShopModule {

}
