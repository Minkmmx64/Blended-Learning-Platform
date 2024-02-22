
import { Module } from "@nestjs/common";
import { SignController } from "./sign.controller";
import { SignService } from "./sign.service";
import { StuDAO } from "../stu/stu.dao";
import { RedisService } from "src/Modules/redis/RedisService";

@Module({
  providers: [ SignService, StuDAO, RedisService ],
  controllers: [SignController]
})
export class SignModule {

}
