import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { RoleService } from "./role.service";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ListMetaData, PaginationQuery } from "../index.type";
import { RoleCreateDTO, RoleQueryDTO, RoleUpdateDTO } from "./role.dto";
import { HttpResponse } from "src/response/response";
import { RootRole } from "src/Entity/root_role.entity";
import { AuthGuard } from "src/guard/auth.gurad";
import { RoleCreateValid, RoleUpdateValid } from "./role.valid";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ValidationPipe } from 'src/utils/pipes';

@Controller("role")
export class RoleController {
  constructor(private readonly RoleService: RoleService){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async RoleListsPagination(
    @Query() Query: PaginationQuery<RoleQueryDTO>
  ) {
    const [ error, roles ] = await this.RoleService.RoleListsPagination(Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<RootRole[]>>(HttpStatus.ACCEPTED, roles).send();
  }
  
  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(RoleCreateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async RoleCreate(
      @Body() body: RoleCreateDTO
  ) {
    const [ error, insert ] = await this.RoleService.RoleCreate(body);
    if(error) {
        throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<InsertResult>(HttpStatus.CREATED, insert).send();
  }
  
  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(RoleUpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())
  public async RoleUpdate(
      @Body() body: RoleUpdateDTO
  ) {
    const [ error, update ] = await this.RoleService.RoleUpdate(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, update).send();
  }
  
  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async RoleDelete(
    @Query("id") id: number,
  ) {
    const [ error, del ] = await this.RoleService.RoleDelete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.RESET_CONTENT, del).send();
  }
}