import { Body, Controller, Post } from "@nestjs/common";
import { RootService } from "./root.service";
import { RootRegistDTO } from "./root.dto";


@Controller("/root")
export class RootController {
  constructor(private readonly RootService: RootService){}

  @Post("/regist")
  public RootRegist(
    @Body() body: RootRegistDTO) {
      return body;
    }

}