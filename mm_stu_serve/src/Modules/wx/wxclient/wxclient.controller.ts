
import { BadRequestException, Controller, Get, HttpStatus } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyEntity } from "src/Entity/wx/classify";

@Controller("wx/client")
export class WXClientController {
  
  constructor(private readonly ClassifyService: ClassifyService){}

  @Get("/classify/all")
  public async getAllClassify() {
    const [ error, classify ] = await this.ClassifyService.ClassifyAll();
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ClassifyEntity[]>(HttpStatus.ACCEPTED, classify).send();
  }
}