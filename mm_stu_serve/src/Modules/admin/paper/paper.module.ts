import { Module } from "@nestjs/common";
import { PaperController } from "./paper.controller";
import { PaperService } from "./paper.service";


@Module({
  providers: [PaperService],
  controllers: [PaperController]
})
export class PaperModule {

}
