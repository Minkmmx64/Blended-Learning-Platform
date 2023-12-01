import { StuCollege } from "src/Entity/stu_college.entity";
import { DataSource, InsertResult, SelectQueryBuilder } from "typeorm";
import { CollegeUpdateDTO, StuCollegeCreateDTO, StuCollegeQueryDTO } from "./college.dto";
import { ToOrder } from "src/common/common";
import { PaginationQuery } from "../index.type";

export class CollegeServiceDAO {
  constructor(protected DataSource : DataSource){};

  public StuCollegeRepository = this.DataSource.getRepository(StuCollege);

  public async CreateStuCollege(college: StuCollegeCreateDTO): Promise<InsertResult> {
    try {
      return await this.StuCollegeRepository.insert({
        name: college.name,
        remark: college.remark
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async CollegeListsPagination(CollegeQuery: PaginationQuery<StuCollegeQueryDTO>) {
    const Order = ToOrder(CollegeQuery);

    const SelectQueryBuilder: SelectQueryBuilder<StuCollege> = this.StuCollegeRepository.createQueryBuilder().select()
    if(CollegeQuery.name){
      SelectQueryBuilder
                        .where("name = :name")
                        .setParameter("name", CollegeQuery.name);
    }
    
    return await SelectQueryBuilder
                                   .orderBy(CollegeQuery.prop, Order)
                                   .skip(CollegeQuery.limit * (CollegeQuery.offset - 1))
                                   .take(CollegeQuery.limit)
                                   .getMany();
  }

  public async UpdateCollegeById(MenuUpdate: CollegeUpdateDTO) {
    return await this.StuCollegeRepository
                     .createQueryBuilder()
                     .update()
                     .set({
                       name: MenuUpdate.data.name,
                       remark: MenuUpdate.data.remark
                     })
                     .where("id = :id")
                     .setParameter("id", MenuUpdate.id)
                     .execute();
  }

  public async DeleteCollegeById(id: number) {
    //创建事务
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const DeleteResult = await this.StuCollegeRepository
                                     .createQueryBuilder(null, queryRunner)
                                     .delete()
                                     .where("id = :id")
                                     .setParameter("id", id)
                                     .execute();
      //提交事务
      await queryRunner.commitTransaction();
      return DeleteResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
  public async Total() {
    return await this.StuCollegeRepository
                     .createQueryBuilder()
                     .select()
                     .getCount();
  }
}