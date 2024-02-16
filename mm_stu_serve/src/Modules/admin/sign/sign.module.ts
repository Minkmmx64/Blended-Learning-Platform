
import { Module } from "@nestjs/common";
import { SignController } from "./sign.controller";
import { SignService } from "./sign.service";


@Module({
  providers: [SignService],
  controllers: [SignController]
})
export class SignModule {

}
