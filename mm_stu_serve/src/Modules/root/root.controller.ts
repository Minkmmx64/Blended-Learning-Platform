import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO } from "./root.dto";
import { ValidationPipe } from "src/utils/pipes";
import { RootRegistSchema } from "./root.valid";


@Controller("/root")
export class RootController {
  constructor(private readonly RootService: RootService){}

  @Post("/regist")
  @UsePipes(new ValidationPipe(RootRegistSchema))
  public RootRegist(
    @Body() body: RootRegistDTO) {
      return this.RootService.RootRegist(body);
    }

}