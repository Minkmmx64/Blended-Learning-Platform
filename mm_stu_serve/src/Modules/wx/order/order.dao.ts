import { InsertResult, Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { OrderEntity } from "src/Entity/wx/order";
import { OrderCreateDTO } from "./order.dto";
import { randomUUID } from "crypto";



@Injectable()
export class OrderDAO {
  constructor(
    @InjectRepository(OrderEntity, 'WXConnection')
    private readonly OrderRepository: Repository<OrderEntity>,
  ){}
  
  public async OrderCreate(OrderCreate: OrderCreateDTO) : Promise<InsertResult[]> {
    
    const QueryBuilder = this.OrderRepository.createQueryBuilder().insert();

    const InsertResult = [] as InsertResult[];

    OrderCreate.shops.forEach( async shop => {
      const result = await QueryBuilder.values({
        Serial: (new Date()).toString(),
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

}