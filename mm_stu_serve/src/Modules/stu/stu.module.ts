
import { Module } from "@nestjs/common";
import { StuController } from "./stu.controller";
import { StuService } from "./stu.service";


@Module({
  providers: [StuService],
  controllers: [StuController]
})
export class StuModule {

}
