import { BadRequestException, Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO , RootLoginDTO } from "./root.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RootRegistSchema, RootLoginSchema } from "./root.valid";
import { HttpResponse } from "src/response/response";
import { InsertResult } from "typeorm";

@Controller("/root")
export class RootController {
  constructor(private readonly RootService: RootService){}

  @Post("/regist")
  @UsePipes(new ValidationPipe(RootRegistSchema))
  public async RootRegist(
    @Body() body: RootRegistDTO) {
      const [ error, insert ] = await this.RootService.RootRegist(body);
      if(error){
        throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error).send());
      } else return new HttpResponse<InsertResult>(HttpStatus.CREATED, insert).send();
    }

  @Post("/login")
  @UsePipes(new ValidationPipe(RootLoginSchema))
  public async RootLogin (
    @Body() body : RootLoginDTO
  ) {
    const [ error, user ] = await this.RootService.RootLogin(body);
    if(error){
      throw new BadRequestException(new HttpResponse<any>(HttpStatus.BAD_REQUEST, null,  error).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.ACCEPTED, user).send();
  }

}