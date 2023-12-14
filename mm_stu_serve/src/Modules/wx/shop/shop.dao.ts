import { DataSource, DeleteResult, InsertResult, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ShopCreateDTO, ShopQueryDTO, ShopUpdateDTO } from "./shop.dto";
import { ToOrder } from "src/common/common";
import { ShopEntity } from "src/Entity/wx/shop";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ShopDAO {
  constructor(
    @InjectRepository(ShopEntity, 'WXConnection')
    private readonly ShopRepository: Repository<ShopEntity>,
  ){}

  public async ShopListsPagination(ShopQuery: PaginationQuery<ShopQueryDTO>): Promise<ShopEntity[]> {

    const Order = ToOrder(ShopQuery);
    const SelectQueryBuilder: SelectQueryBuilder<ShopEntity> = this.ShopRepository.createQueryBuilder("shop").leftJoinAndSelect("shop.classify", "classify");

    if(ShopQuery.name) {
      SelectQueryBuilder
                        .andWhere("shop.name LIKE :name")
                        .setParameter("name", `%${ShopQuery.name}%`)
    }

    if(ShopQuery.classify_id) {
      SelectQueryBuilder
                        .andWhere("shop.classify_id = :classify_id")
                        .setParameter("classify_id", ShopQuery.classify_id)
    }

    if(ShopQuery.prop) {
      SelectQueryBuilder
                                   .orderBy("shop." + ShopQuery.prop, Order)
    }

    return await SelectQueryBuilder
                                   .skip(ShopQuery.limit * (ShopQuery.offset - 1))
                                   .take(ShopQuery.limit)
                                   .getMany();
  }

  public async CreateShop(CreateShop: ShopCreateDTO): Promise<InsertResult> {

    const result = await this.ShopRepository
                             .createQueryBuilder()
                             .insert()
                             .into(ShopEntity)
                             .values({
                              name: CreateShop.name,
                              avatar: CreateShop.avatar,
                              stock: CreateShop.stock,
                              prices: CreateShop.prices,
                              remark: CreateShop.remark,
                              classify: {
                                id: CreateShop.classify_id
                              }
                             }).execute();
    return result;
  }

  public async UpdateShopById(UpdateShop: ShopUpdateDTO): Promise<UpdateResult> {

    const result = await this.ShopRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              name: UpdateShop.data.name,
                              avatar: UpdateShop.data.avatar,
                              prices: UpdateShop.data.prices,
                              remark: UpdateShop.data.remark,
                              classify: {
                                id: UpdateShop.data.classify_id
                              }
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateShop.id)
                             .execute();
    return result;
  }

  public async DeleteShopById(id: number) : Promise<DeleteResult> {

    const result = await this.ShopRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.ShopRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
