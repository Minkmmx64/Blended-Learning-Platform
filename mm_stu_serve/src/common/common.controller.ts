import { Controller, Get, Session, Res, Post, Body, Req } from "@nestjs/common";
import { CommonService } from "./common.service";
import { Request, Response } from "express";

@Controller("/common")
export class CommonController {
    constructor(private readonly CommonService: CommonService){}
    @Get("/sms")
    public getSmsCode(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Session() session: Record<string , any>,
    ){
        
        return this.CommonService.getSmsCode(req, res, session);
    }

    @Post("/vsms")
    public vSmsCode(
        @Req() req: Request,
        @Body("code") code : string,
        @Session() session: Record<string, any>
    ){
        return this.CommonService.vSmsCode(req, code, session);
    } 
}