
import { Module } from "@nestjs/common";
import { WXClientController } from "./wxclient.controller";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyDAO } from "../classify/classify.dao";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassifyEntity } from "src/Entity/wx/classify";


@Module({
  imports: [
    TypeOrmModule.forFeature([ClassifyEntity], 'WXConnection')
  ],
  providers: [ ClassifyService, ClassifyDAO ],
  controllers: [WXClientController]
})
export class WXClientModule {

}
