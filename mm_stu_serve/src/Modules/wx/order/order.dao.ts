import { InsertResult, Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { OrderEntity } from "src/Entity/wx/order";
import { OrderCreateDTO } from "./order.dto";
import * as uuid from "uuid";

@Injectable()
export class OrderDAO {
  constructor(
    @InjectRepository(OrderEntity, 'WXConnection')
    private readonly OrderRepository: Repository<OrderEntity>,
  ){}
  
  public async OrderCreate(OrderCreate: OrderCreateDTO) : Promise<InsertResult[]> {
    
    const QueryBuilder = this.OrderRepository.createQueryBuilder();

    const InsertResult = [] as InsertResult[];

    OrderCreate.shops.forEach( async shop => {
      const result = await QueryBuilder.insert().values({
        Serial: uuid.v1(),
        count: shop.count,
        shop: {
          id: shop.id
        },
        payment: shop.prices,
        pay_status: OrderCreate.status,
        openid: OrderCreate.openid
      }).execute();
      InsertResult.push(result);
    })

    return InsertResult;
  }

  public async OrderList(openid: string, status: string) : Promise<OrderEntity[]> {
    const SelectQueryBuilder = this.OrderRepository
                                   .createQueryBuilder("order")
                                   .leftJoinAndSelect("order.shop", "shop")
                                   .select()
                                   .where("order.openid = :openid")
                                   .setParameter("openid", openid);
    if(status !== "" && status) {
      return await SelectQueryBuilder.andWhere("order.pay_status = :status").setParameter("status", status).getMany();
    }else return await SelectQueryBuilder.getMany();
  }

}