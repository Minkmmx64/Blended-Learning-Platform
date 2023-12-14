
import { Module } from "@nestjs/common";
import { ClassifyController } from "./classify.controller";
import { ClassifyService } from "./classify.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { ClassifyDAO } from "./classify.dao";


@Module({
  imports: [
    TypeOrmModule.forFeature([ClassifyEntity], 'WXConnection')
  ],
  providers: [ClassifyService, ClassifyDAO],
  controllers: [ClassifyController]
})
export class ClassifyModule {

}
