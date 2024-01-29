import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { resourceCreateDTO, resourceQueryDTO, resourceUpdateDTO } from "./resource.dto";
import { ToOrder } from "src/common/common";
import { StuCourseResource } from "src/Entity/stu_course_resource.entity";

export class resourceDAO {
  constructor(protected DataSource: DataSource){}

  public resourceRepository = this.DataSource.getRepository(StuCourseResource);

  public async resourceListsPagination(resourceQuery: PaginationQuery<resourceQueryDTO>): Promise<StuCourseResource[]> {

    const Order = ToOrder(resourceQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuCourseResource> = this.resourceRepository
                                                                          .createQueryBuilder("resource")
                                                                          .leftJoinAndSelect("resource.chapter", "mm_stu_stu_chapter")
                                                                          .leftJoinAndSelect("mm_stu_stu_chapter.course", "mm_stu_stu_course");
    if(resourceQuery.prop) {
      SelectQueryBuilder
                        .orderBy("resource." + resourceQuery.prop, Order)
    }

    return await SelectQueryBuilder
                                   
                                   .skip(resourceQuery.limit * (resourceQuery.offset - 1))
                                   .take(resourceQuery.limit)
                                   .getMany();
  }

  public async Createresource(Createresource: resourceCreateDTO): Promise<InsertResult> {
    const result = await this.resourceRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuCourseResource)
                             .values({
                                remark: Createresource.remark,
                                name: Createresource.name,
                                chapter: {
                                  id: Createresource.chapter_id
                                },
                                cover: Createresource.cover,
                                src: Createresource.src,
                                type: Createresource.type
                             }).execute();
    return result;
  }

  public async UpdateresourceById(Updateresource: resourceUpdateDTO): Promise<UpdateResult> {

    const result = await this.resourceRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                              remark: Updateresource.data.remark,
                                name: Updateresource.data.name,
                                chapter: {
                                  id: Updateresource.data.chapter_id
                                },
                                cover: Updateresource.data.cover,
                                src: Updateresource.data.src,
                                type: Updateresource.data.type
                             })
                             .where("id = :id")
                             .setParameter("id", Updateresource.id)
                             .execute();
    return result;
  }

  public async DeleteresourceById(id: number) : Promise<DeleteResult> {

    const result = await this.resourceRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.resourceRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  public async getChapterResourceByChapterId(chapterId: number) {
    return await this.resourceRepository
                     .createQueryBuilder()
                     .where("chapter_id = :chapter_id")
                     .setParameter("chapter_id", chapterId)
                     .getMany();
  }
}
