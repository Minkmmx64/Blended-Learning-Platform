import { Module } from "@nestjs/common";
import { StuCollegeController } from "./college.controller";
import { StuCollegeService } from "./college.service";

@Module({
    controllers:[StuCollegeController],
    providers:[StuCollegeService],
    imports: [],
    exports : [StuCollegeService]
})
export class StuCollegeModule {}