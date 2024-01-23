import { Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";
import { RedisService } from "src/Modules/redis/RedisService";
import { ChapterService } from "../chapter/chapter.service";


@Module({
    controllers:[CommonController],
    providers:[CommonService, RedisService, ChapterService],
    imports: []
})
export class CommonModule {
    
}