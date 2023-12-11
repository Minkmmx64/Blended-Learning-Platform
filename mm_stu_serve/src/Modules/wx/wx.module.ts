import { Module } from "@nestjs/common";
import { WXController } from "./wx.controller";

@Module({
  controllers: [WXController]
})
export class WXModule{}