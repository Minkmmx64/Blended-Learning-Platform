import { Module } from "@nestjs/common";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { StuDAO } from "../stu/stu.dao";


@Module({
  providers: [ExamService, StuDAO],
  controllers: [ExamController]
})
export class ExamModule {

}
