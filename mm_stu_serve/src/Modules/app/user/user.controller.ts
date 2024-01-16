import { BadRequestException, Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { LoginData, RegisterData } from "./user.dto";
import { ValidationPipe } from "src/utils/pipes";
import { LoginDataValid, RegisterDataValid } from "./user.valid";
import { AppUserService } from "./user.service";
import { InsertResult } from "typeorm";
@Controller("/app/user")
export class AppUSerController {

  constructor(
    private readonly AppUserService: AppUserService,
  ){}

  @Post("/regist")
  @UsePipes(new ValidationPipe(RegisterDataValid))
  public async AppUserRegist(
    @Body() regist: RegisterData
  ) {
    const [ error, InsertResult ] = await this.AppUserService.AppUserRegist(regist);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.ACCEPTED, InsertResult).send();
  }
  
  @Post("/login")
  @UsePipes(new ValidationPipe(LoginDataValid))
  public async AppUserLogin(
    @Body() login: LoginData
  ) {
    const [ error, LoginResult ] = await this.AppUserService.AppUserLogin(login);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse(HttpStatus.ACCEPTED, LoginResult).send();
  }
}