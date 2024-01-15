import { Module } from "@nestjs/common";
import { AppUSerController } from "./user.controller";

@Module({
  controllers: [ AppUSerController ] 
})
export class AppUserModule {
  
}