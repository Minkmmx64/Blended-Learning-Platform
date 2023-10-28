import { Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";


@Module({
    controllers:[CommonController],
    providers:[CommonService],
    imports: []
})
export class CommonModule {
    
}