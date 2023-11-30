import { Controller, Post, Body, UseInterceptors, UsePipes, UseGuards, BadRequestException, HttpStatus, Get, Query, Delete, Put, Param} from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuCreateDTO, MenuQueryDTO, MenuUpdateDTO } from './menu.dto';
import { ValidationPipe } from 'src/utils/pipes';
import { MenuCreateValid, MenuUpdateValid } from './menu.valid';
import { AuthGuard } from 'src/guard/auth.gurad';
import { TokenExpireInterceptor } from 'src/guard/token.interceptor';
import { HttpResponse } from 'src/response/response';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ListMetaData, PaginationQuery } from '../index.type';
import { RootRouters } from 'src/Entity/root_routers.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(MenuCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuCreate(
    @Body() Body: MenuCreateDTO
  ) {
    const [ error, InsertResult ] = await this.menuService.MenuCreate(Body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.CREATED, InsertResult).send();
  }

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuList(
    @Query() Query: PaginationQuery<MenuQueryDTO>
  ) {
    const [ error, menus ] = await this.menuService.MenuListsPagination(Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<RootRouters[]>>(HttpStatus.ACCEPTED, menus).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuDelete(
    @Query("id") id: number,
  ) {
    const [ error, DeleteResult ] = await this.menuService.MenuDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(MenuUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuUpdate(
    @Body() Body : MenuUpdateDTO
  ) {
    const [ error, UpdateResult ] = await this.menuService.MenuUpdate(Body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Get("/all")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuAll() {
    const [ error, all ] = await this.menuService.MenuAll();
    if(error) {
      throw new BadRequestException(new HttpResponse<RootRouters[]>(HttpStatus.BAD_REQUEST, all,  error.message).send());
    } else return new HttpResponse<RootRouters[]>(HttpStatus.RESET_CONTENT, all).send();
  }
}
