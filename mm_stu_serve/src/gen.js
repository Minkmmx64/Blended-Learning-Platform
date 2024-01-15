const process = require("node:process");
const fs = require("node:fs");
const id = process.argv[2];
const path = require("node:path");
const controller = `
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { ListMetaData, PaginationQuery } from "../index.type";
import { HttpResponse } from "src/response/response";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { AuthGuard } from "src/guard/auth.gurad";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { ValidationPipe } from "src/utils/pipes";
import { ${id}Service } from "./${id.toLowerCase()}.service";
import { ${id}CreateDTO, ${id}UpdateDTO, ${id}QueryDTO } from "./${id.toLowerCase()}.dto";
import { ${id}CreateValid, ${id}UpdateValid } from "./${id.toLowerCase()}.valid";
@Controller("${id.toLowerCase()}")
export class ${id}Controller {
  
  constructor(private readonly ${id}Service: ${id}Service){}

  @Get("/list")
  @UseInterceptors(new TokenExpireInterceptor())
  public async ${id}ListsPagination(
    @Query() ${id}Query: PaginationQuery<${id}QueryDTO>
  ) {
    const [ error, ${id}s ] = await this.${id}Service.${id}ListsPagination(${id}Query);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<ListMetaData<StuClass[]>>(HttpStatus.ACCEPTED, ${id}s).send();
  }

  @Post("/create")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(${id}CreateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ${id}Create(
    @Body() body: ${id}CreateDTO
  ){
    const [error, InsertResult ] = await this.${id}Service.${id}Create(body);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    }
    return new HttpResponse<InsertResult>(HttpStatus.RESET_CONTENT, InsertResult).send();
  }

  @Put("/update")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe(${id}UpdateValid))
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public async ${id}Update(
    @Body() body: ${id}UpdateDTO
  ){
    const [ error, UpdateResult ] = await this.${id}Service.${id}Update(body);
    if(error) {
      throw new BadRequestException(new HttpResponse<UpdateResult>(HttpStatus.BAD_REQUEST, UpdateResult,  error.message).send());
    } else return new HttpResponse<UpdateResult>(HttpStatus.RESET_CONTENT, UpdateResult).send();
  }

  @Delete("/delete")
  @UseGuards(new AuthGuard())
  @UseInterceptors(new TokenExpireInterceptor())
  public async ${id}Delete(
    @Query("id") id: number,
  ){
    const [ error, DeleteResult ] = await this.${id}Service.${id}Delete(id);
    if(error) {
      throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    } else return new HttpResponse<DeleteResult>(HttpStatus.ACCEPTED, DeleteResult).send();
  }
}`

const service = `
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../index.type";
import { ${id}DAO } from "./${id.toLowerCase()}.dao";
import { ${id}CreateDTO, ${id}UpdateDTO, ${id}QueryDTO } from "./${id.toLowerCase()}.dto";

@Injectable()
export class ${id}Service{
  constructor(private readonly DataSource: DataSource){}

  public ${id}DAO = new ${id}DAO(this.DataSource); 

  public async ${id}ListsPagination(${id}Query: PaginationQuery<${id}QueryDTO>): ServiceData<ListMetaData<>> {
    try {
      const ${id}s = await this.${id}DAO.${id}ListsPagination(${id}Query);
      const res: ListMetaData<${id}Info[]> = {
        list: ${id}s,
        meta: {
          total: await this.${id}DAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ${id}Create(${id}Create: ${id}CreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.${id}DAO.Create${id}(${id}Create);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ${id}Update(${id}Update : ${id}UpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.${id}DAO.Update${id}ById(${id}Update);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ${id}Delete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.${id}DAO.Delete${id}ById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}`
const modules = `
import { Module } from "@nestjs/common";
import { ${id}Controller } from "./${id.toLowerCase()}.controller";
import { ${id}Service } from "./${id.toLowerCase()}.service";


@Module({
  providers: [${id}Service],
  controllers: [${id}Controller]
})
export class ${id}Module {

}
`
const dao = `
import { StuInfo } from "src/Entity/stu_info.entity";
import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { ${id}CreateDTO, ${id}QueryDTO, ${id}UpdateDTO } from "./${id.toLowerCase()}.dto";
import { ToOrder } from "src/common/common";

export class ${id}DAO {
  constructor(protected DataSource: DataSource){}

  public ${id}Repository = this.DataSource.getRepository(Stu${id});

  public async ${id}ListsPagination(${id}Query: PaginationQuery<${id}QueryDTO>): Promise<${id}[]> {

    const Order = ToOrder(${id}Query);
    const SelectQueryBuilder: SelectQueryBuilder<${id}> = this.${id}Repository.createQueryBuilder().select();

    return await SelectQueryBuilder
                                   .orderBy(${id}Query.prop, Order)
                                   .skip(${id}Query.limit * (${id}Query.offset - 1))
                                   .take(${id}Query.limit)
                                   .getMany();
  }

  public async Create${id}(Create${id}: ${id}CreateDTO): Promise<InsertResult> {

    const result = await this.${id}Repository
                             .createQueryBuilder()
                             .insert()
                             .into(Stu${id})
                             .values({
                                
                             }).execute();
    return result;
  }

  public async Update${id}ById(Update${id}: ${id}UpdateDTO): Promise<UpdateResult> {

    const result = await this.${id}Repository
                             .createQueryBuilder()
                             .update()
                             .set({
                            
                             })
                             .where("id = :id")
                             .setParameter("id", Update${id}.id)
                             .execute();
    return result;
  }

  public async Delete${id}ById(id: number) : Promise<DeleteResult> {

    const result = await this.${id}Repository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.${id}Repository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
`
const valid = `
import * as Joi from "joi";
import { ${id}CreateDTO, ${id}UpdateDTO } from "./stu.dto"; 

export const ${id}CreateValid = Joi.object<${id}CreateDTO>({

})

export const ${id}UpdateValid = Joi.object<${id}UpdateDTO>({

})
`
const dto = `
export class ${id}CreateDTO{

}

export class ${id}QueryDTO {

}

export class ${id}UpdateDTO {
  id: number;
  data: ${id}CreateDTO;
}
`
fs.mkdirSync(path.join(__dirname, "Modules", `${id.toLowerCase()}`));
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`, `${id.toLowerCase()}.controller.ts`)).write(controller);
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`, `${id.toLowerCase()}.service.ts`)).write(service);
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`, `${id.toLowerCase()}.module.ts`)).write(modules);
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`,`${id.toLowerCase()}.valid.ts`)).write(valid);
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`,`${id.toLowerCase()}.dao.ts`)).write(dao);
fs.createWriteStream(path.join(__dirname, "Modules",`${id.toLowerCase()}`,`${id.toLowerCase()}.dto.ts`)).write(dto);