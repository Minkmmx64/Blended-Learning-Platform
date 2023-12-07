import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { ClassCreateDTO, ClassQueryDTO, ClassUpdateDTO } from "./class.dto";
import { StuClass } from "src/Entity/stu_class.entity";
import { ToOrder } from "src/common/common";

export class ClassDAO {
  constructor(protected DataSource: DataSource){}

  public ClassRepository = this.DataSource.getRepository(StuClass);

  public async ClassListsPagination(ClassQuery: PaginationQuery<ClassQueryDTO>): Promise<StuClass[]> {

    const Order = ToOrder(ClassQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuClass> = this.ClassRepository.createQueryBuilder("class").leftJoinAndSelect("class.college", "mm_stu_stu_college");

    if(ClassQuery.name) {
      SelectQueryBuilder
                        .where("class.name LIKE :name")
                        .setParameter("name", `%${ClassQuery.name}%`);
    }

    if(ClassQuery.prop) {
      SelectQueryBuilder
                        .orderBy(`class.${ClassQuery.prop}`, Order)
    }

    return await SelectQueryBuilder
                                   .skip(ClassQuery.limit * (ClassQuery.offset - 1))
                                   .take(ClassQuery.limit)
                                   .getMany();
  }

  public async CreateClass(CreateClass: ClassCreateDTO): Promise<InsertResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuClass)
                             .values({
                                name: CreateClass.name,
                                college: {
                                  id: CreateClass.college_id
                                },
                                remark: CreateClass.remark,
                                code: CreateClass.code
                             }).execute();
    return result;
  }

  public async UpdateClassById(UpdateClass: ClassUpdateDTO): Promise<UpdateResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              college: {
                                id: UpdateClass.data.college_id
                              },
                              name: UpdateClass.data.name,
                              remark: UpdateClass.data.remark
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateClass.id)
                             .execute();
    return result;
  }

  public async DeleteClassById(id: number) : Promise<DeleteResult> {

    const result = await this.ClassRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async ClassAll(){
    return await this.ClassRepository
                     .createQueryBuilder("class")
                     .leftJoinAndSelect("class.college", "mm_stu_stu_college")
                     .getMany();
  }

  public async Total() : Promise<number> {
    return await this.ClassRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}