import { Body, Controller, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { RegisterData } from "./user.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RegisterDataValid } from "./user.valid";
@Controller("/app/user")
export class AppUSerController {

  @Post("/regist")
  @UsePipes(new ValidationPipe(RegisterDataValid))
  public async AppUserRegist(
    @Body() body: RegisterData
  ) {
    console.log(body);
    return new HttpResponse(HttpStatus.ACCEPTED, body).send();
  }
}