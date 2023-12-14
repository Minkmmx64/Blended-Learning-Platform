import { Injectable } from "@nestjs/common";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { ShopDAO } from "./shop.dao";
import { ShopCreateDTO, ShopUpdateDTO, ShopQueryDTO } from "./shop.dto";
import { ShopEntity } from "src/Entity/wx/shop";

@Injectable()
export class ShopService{
  constructor( private readonly ShopDAO: ShopDAO){}

  public async ShopListsPagination(ShopQuery: PaginationQuery<ShopQueryDTO>): ServiceData<ListMetaData<ShopEntity[]>> {
    try {
      const Shops = await this.ShopDAO.ShopListsPagination(ShopQuery);
      const res: ListMetaData<ShopEntity[]> = {
        list: Shops,
        meta: {
          total: await this.ShopDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ShopCreate(ShopCreate: ShopCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.ShopDAO.CreateShop(ShopCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ShopUpdate(ShopUpdate : ShopUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.ShopDAO.UpdateShopById(ShopUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ShopDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.ShopDAO.DeleteShopById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}