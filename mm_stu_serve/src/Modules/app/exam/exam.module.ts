import { Module } from "@nestjs/common";
import { AppExamService } from "./exam.service";
import { AppExamController } from "./exam.controller";
import { ExamDAO } from "src/Modules/admin/exam/exam.dao";

@Module({
  providers: [ AppExamService, ExamDAO ],
  controllers: [ AppExamController ]
})
export class AppExamModule {

}