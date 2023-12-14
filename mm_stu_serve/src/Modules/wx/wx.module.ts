import { Module } from "@nestjs/common";
import { WXController } from "./wx.controller";
import { WXService } from "./wx.service";

@Module({
  providers: [WXService],
  controllers: [WXController]
})
export class WXModule{}