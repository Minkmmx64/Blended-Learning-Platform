
import { BadRequestException, Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { ShopService } from "../shop/shop.service";
import { WXClientShopQueryDTO } from "./wxclient.dto";
import { ShopEntity } from "src/Entity/wx/shop";

@Controller("wx/client")
export class WXClientController {
  
  constructor(
    private readonly ClassifyService: ClassifyService,
    private readonly ShopService: ShopService
  ){}

  @Get("/classify/all")
  public async getAllClassify() {
    const [ error, classify ] = await this.ClassifyService.ClassifyAll();
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ClassifyEntity[]>(HttpStatus.ACCEPTED, classify).send();
  }

  @Get("/shop/all")
  public async getAllShop(
    @Query() Query: WXClientShopQueryDTO
  ) {
    const [ error, shop ] = await this.ShopService.ShopAll(Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ShopEntity[]>(HttpStatus.ACCEPTED, shop).send();
  }
}