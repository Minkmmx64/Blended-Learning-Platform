import { Controller, BadRequestException, Get, Session, Post, Body, HttpStatus, UsePipes, GoneException, Headers, ConflictException, UseInterceptors, UploadedFile, Query, UseGuards } from "@nestjs/common";
import { CommonService } from "./common.service";
import { HttpResponse } from "src/response/response";
import { ValidationPipe } from "src/utils/pipes";
import { CommonSmsValid, CommonTokenValid } from "./common.valid";
import { IFileUploadStart, IFileisExist, SmsDTO, vTokenDTO } from "./common.dto";
import { JwtPayload } from "jsonwebtoken";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express'
import { RedisService } from "src/Modules/redis/RedisService";
import { AuthGuard } from "src/guard/auth.gurad";
@Controller("/common")
export class CommonController {

  constructor(
    private readonly CommonService: CommonService,
    private readonly RedisService: RedisService
  ) { }

  //获取图形验证码
  @Get("/sms")    
  public async getSmsCode(@Session() session: Record<string, any>) {
    const code = await this.CommonService.getSmsCode(session);
    return new HttpResponse<string>(HttpStatus.NO_CONTENT, code).send();
  }
  
  //提交验证码r
  @Post("/sms") 
  @UsePipes(new ValidationPipe(CommonSmsValid))
  public async vSmsCode(
    @Body() body: SmsDTO,
    @Session() session: Record<string, any>
  ) {
    const verify = await this.CommonService.vSmsCode(body.code, session);
    if(verify) {
      return new HttpResponse<null>(HttpStatus.NO_CONTENT).send();
    } else { 
      return new HttpResponse<null>(HttpStatus.FORBIDDEN).send();
    }
  }

  //验证Token有效性
  @Post("/vtoken")
  @UsePipes(new ValidationPipe(CommonTokenValid))
  public vToken(
    @Body() body: vTokenDTO
  ) {
    const [ error ] = this.CommonService.vToken(body.token);
    if(error) {
      //token超过失效
      if(error === "TokenExpiredError: jwt expired") {
        throw new GoneException(new HttpResponse<null>(HttpStatus.GONE, null,  error).send());
      } else {
        throw new ConflictException(new HttpResponse<string | JwtPayload>(HttpStatus.CONFLICT, null, error.toString() ).send());
      }
    } else {
      return new HttpResponse<string | JwtPayload>(HttpStatus.ACCEPTED, "ok").send();
    }
  }

  //刷新Token
  @Get("/rtoken")
  public async rToken(
    @Headers("Authorization") Authorization: string
  ) {
    const [ error, Token ] = this.CommonService.rToken(Authorization);
    if(error){
      throw new ConflictException(new HttpResponse(HttpStatus.CONFLICT, null,  error.message).send());
    }
    return  new HttpResponse<{ token : string }>(HttpStatus.ACCEPTED, {
      token: Token
    }).send();
  }

  /**
   * 小文件上传
   * @returns md5 url
   * @param file 小文件
   * @returns 
   */
  @Post("/upload")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  @UseInterceptors(FileInterceptor("file"))
  public async FileUpload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [ error, url ] = await this.CommonService.FileUpload(file);
    if(error) throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    return new HttpResponse<{ url : string }>(HttpStatus.ACCEPTED, { url: url }).send();
  }

  @Get("/upload/slice/start")
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async FileUploadStart(
    @Query("md5") md5 : string,
    @Query("filename") filename: string
  ){
    const [ error, data ] = await this.CommonService.FileUploadStart(md5, filename);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
      return new HttpResponse<IFileUploadStart | IFileisExist>(HttpStatus.ACCEPTED, data).send();
  }

  @Post("/upload/slice")
  @UseInterceptors(FileInterceptor("file"))
  public async FileUploadSlice(
    @UploadedFile() file: Express.Multer.File,
    @Body("number") number: number,
    @Body("md5") md5: string
  ) {
    // 1、获取文件位置，以及文件序号,将文件保存到硬盘
    const [ error, status ] = await this.CommonService.FileUploadSlice(file, number, md5);
    if(error) throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    return new HttpResponse(HttpStatus.ACCEPTED, status ).send();
  }

  @Post("/upload/merge") //开始合并文件
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async MergeFile(
    @Body("filename") filename: string
  ) {
    const [ error, status ] = await this.CommonService.MergeFile(filename);
    if(error) throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    return new HttpResponse(HttpStatus.ACCEPTED, status ).send();
  }






  //测试接口
  @Get("/test")
  //@UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public test(){
    return new HttpResponse(HttpStatus.ACCEPTED, { mjw: "ok" }).send();
  }
}