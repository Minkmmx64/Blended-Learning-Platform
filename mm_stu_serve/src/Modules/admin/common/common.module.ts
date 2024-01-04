import { Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";
import { RedisService } from "src/Modules/redis/RedisService";


@Module({
    controllers:[CommonController],
    providers:[CommonService, RedisService],
    imports: []
})
export class CommonModule {
    
}