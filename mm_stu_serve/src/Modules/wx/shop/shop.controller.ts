import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ShopService } from "./shop.service";
import { ShopCreateDTO, ShopUpdateDTO, ShopQueryDTO } from "./shop.dto";
import { ShopCreateValid, ShopUpdateValid } from "./shop.valid";
import { ShopEntity } from "src/Entity/wx/shop";
@Controller("wx/shop")
export class ShopController {
  
  constructor(private readonly ShopService: ShopService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ShopListsPagination(
    @Query() ShopQuery: PaginationQuery<ShopQueryDTO>
  ) {
    const [ error, Shops ] = await this.ShopService.ShopListsPagination(ShopQuery);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<ShopEntity[]>>(HttpStatus.ACCEPTED, Shops).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ShopCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ShopCreate(
    @Body() body: ShopCreateDTO
  ){
    body.detail = body.detail.filter( d => d !== null && d !== undefined);
    const [error, InsertResult ] = await this.ShopService.ShopCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(ShopUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ShopUpdate(
    @Body() body: ShopUpdateDTO
  ){
    body.data.detail = body.data.detail.filter( d => d !== null && d !== undefined);
    const [ error, UpdateResult ] = await this.ShopService.ShopUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async ShopDelete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.ShopService.ShopDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}