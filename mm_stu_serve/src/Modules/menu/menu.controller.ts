import { Controller, Post, Body, UseInterceptors, UsePipes, UseGuards, BadRequestException, HttpStatus, Get, Query} from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuCreateDTO, MenuQueryDTO } from './menu.dto';
import { ValidationPipe } from 'src/utils/pipes';
import { MenuCreateValid } from './menu.valid';
import { AuthGuard } from 'src/guard/auth.gurad';
import { TokenExpireInterceptor } from 'src/guard/token.interceptor';
import { HttpResponse } from 'src/response/response';
import { InsertResult } from 'typeorm';
import { PaginationQuery } from '../index.type';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(MenuCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuCreate(
    @Body() body: MenuCreateDTO
  ) {
    const [ error, InsertResult ] = await this.menuService.MenuCreate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async MenuList(
    @Query() Param: PaginationQuery<MenuQueryDTO>
  ) {
    console.log(Param);
    return Param;
  }
}
