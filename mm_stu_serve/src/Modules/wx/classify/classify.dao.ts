
import { StuInfo } from "src/Entity/stu_info.entity";
import { DataSource, DeleteResult, InsertResult, Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ClassifyCreateDTO, ClassifyQueryDTO, ClassifyUpdateDTO } from "./classify.dto";
import { ToOrder } from "src/common/common";
import { ClassifyEntity } from "src/Entity/wx/classify";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ClassifyDAO {
  constructor(
    @InjectRepository(ClassifyEntity, 'WXConnection')
    private readonly ClassifyRepository: Repository<ClassifyEntity>,
  ){}

  public async ClassifyListsPagination(ClassifyQuery: PaginationQuery<ClassifyQueryDTO>): Promise<ClassifyEntity[]> {

    const Order = ToOrder(ClassifyQuery);
    const SelectQueryBuilder: SelectQueryBuilder<ClassifyEntity> = this.ClassifyRepository.createQueryBuilder().select();

    return await SelectQueryBuilder
                                   .orderBy(ClassifyQuery.prop, Order)
                                   .skip(ClassifyQuery.limit * (ClassifyQuery.offset - 1))
                                   .take(ClassifyQuery.limit)
                                   .getMany();
  }

  public async CreateClassify(CreateClassify: ClassifyCreateDTO): Promise<InsertResult> {

    const result = await this.ClassifyRepository
                             .createQueryBuilder()
                             .insert()
                             .into(ClassifyEntity)
                             .values({
                                name: CreateClassify.name,
                                avatar: CreateClassify.avatar,
                                remark: CreateClassify.remark
                             }).execute();
    return result;
  }

  public async UpdateClassifyById(UpdateClassify: ClassifyUpdateDTO): Promise<UpdateResult> {

    const result = await this.ClassifyRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              name: UpdateClassify.data.name,
                              remark: UpdateClassify.data.remark,
                              avatar: UpdateClassify.data.avatar
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateClassify.id)
                             .execute();
    return result;
  }

  public async DeleteClassifyById(id: number) : Promise<DeleteResult> {

    const result = await this.ClassifyRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.ClassifyRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
  
  public async ClassifyAll(){
    return await this.ClassifyRepository
                     .createQueryBuilder()
                     .select()
                     .getMany();
  }

  public async PlatformShop() : Promise<any> {
    const SelectQueryBuilder = await this.ClassifyRepository
                                                      .createQueryBuilder("classify")
                                                      .innerJoinAndSelect("classify.shops", "shop")
                                                      .select(["classify.name", "COUNT(classify.id) as classify_count"])
                                                      .groupBy("classify.id")
                                                      .getRawMany();
                                                      
    return SelectQueryBuilder;
  }
}
