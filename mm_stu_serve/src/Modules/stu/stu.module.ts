
import { Module } from "@nestjs/common";
import { StuController } from "./stu.controller";
import { StuService } from "./stu.service";
import { ClassService } from "../class/class.service";

@Module({
  providers: [StuService, ClassService],
  controllers: [StuController],
  imports: []
})
export class StuModule {

}
