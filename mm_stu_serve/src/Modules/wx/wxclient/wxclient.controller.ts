
import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { HttpResponse } from "src/response/response";
import { ClassifyService } from "../classify/classify.service";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { ShopService } from "../shop/shop.service";
import { OrderCreateDTO, WXClientShopQueryDTO } from "./wxclient.dto";
import { ShopEntity } from "src/Entity/wx/shop";
import { OrderService } from "../order/order.service";
import { InsertResult } from "typeorm";
import { OrderEntity } from "src/Entity/wx/order";

@Controller("wx/client")
export class WXClientController {
  
  constructor(
    private readonly ClassifyService: ClassifyService,
    private readonly ShopService: ShopService,
    private readonly OrderService: OrderService
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


  @Post("/order/create")
  public async OrderCreate(
    @Body() OrderCreate: OrderCreateDTO
  ) {
    const [ error, InsertResult ] = await this.OrderService.OrderCreate(OrderCreate);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<InsertResult[]>(HttpStatus.ACCEPTED, InsertResult).send();
  }

  @Get("/order/list")
  public async OrderList(
    @Query("openid") openid: string,
    @Query("status") status: string
  ) {
    const [ error, orders ] = await this.OrderService.OrderList(openid, status);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<OrderEntity[]>(HttpStatus.ACCEPTED, orders).send();
  }
}