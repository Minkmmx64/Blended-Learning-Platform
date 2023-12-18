import { Injectable } from "@nestjs/common";
import { OrderCreateDTO } from "./order.dto";
import { InsertResult } from "typeorm";
import { OrderDAO } from "./order.dao";
import { ServiceData } from "src/Modules/index.type";

@Injectable()
export class OrderService {

  constructor( private readonly OrderDAO: OrderDAO){}

  public async OrderCreate(OrderCreate: OrderCreateDTO) : ServiceData<InsertResult[]> {
    try {
      const InsertResult = await this.OrderDAO.OrderCreate(OrderCreate);
      return [ null, InsertResult];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}