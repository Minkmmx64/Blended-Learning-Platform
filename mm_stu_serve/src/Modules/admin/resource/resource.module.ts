
import { Module } from "@nestjs/common";
import { resourceController } from "./resource.controller";
import { resourceService } from "./resource.service";


@Module({
  providers: [resourceService],
  controllers: [resourceController]
})
export class resourceModule {

}
