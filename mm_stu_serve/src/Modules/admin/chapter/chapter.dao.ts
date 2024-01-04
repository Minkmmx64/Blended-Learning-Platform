import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { ChapterCreateDTO, ChapterQueryDTO, ChapterUpdateDTO } from "./chapter.dto";
import { ToOrder } from "src/common/common";
import { StuChapter } from "src/Entity/stu_chapter.entity";

export class ChapterDAO {
  constructor(protected DataSource: DataSource){}

  public ChapterRepository = this.DataSource.getRepository(StuChapter);

  public async ChapterListsPagination(ChapterQuery: PaginationQuery<ChapterQueryDTO>): Promise<StuChapter[]> {

    const Order = ToOrder(ChapterQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuChapter> = this.ChapterRepository.createQueryBuilder("chapter").leftJoinAndSelect("chapter.course", "mm_stu_stu_course");

    if(ChapterQuery.name) {
      SelectQueryBuilder
                        .andWhere("chapter.name LIKE :name")
                        .setParameter("name", `%${ChapterQuery.name}%`)
    }
    
    if(ChapterQuery.pid) {
      SelectQueryBuilder
                        .andWhere("chapter.pid = :pid")
                        .setParameter("pid", ChapterQuery.pid)
    }else {
      SelectQueryBuilder
                        .andWhere("chapter.pid IS NULL")
    }

    if(ChapterQuery.course) {
      SelectQueryBuilder
                        .andWhere("chapter.course = :course")
                        .setParameter("course", ChapterQuery.course)
    }

    if(ChapterQuery.prop) {
      SelectQueryBuilder
                         .orderBy("chapter." + ChapterQuery.prop, Order)
    }

    return await SelectQueryBuilder
                                   .skip(ChapterQuery.limit * (ChapterQuery.offset - 1))
                                   .take(ChapterQuery.limit)
                                   .getMany();
  }

  public async CreateChapter(CreateChapter: ChapterCreateDTO): Promise<InsertResult> {

    const result = await this.ChapterRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuChapter)
                             .values({
                                name: CreateChapter.name,
                                course: {
                                  id: CreateChapter.course
                                },
                                remark: CreateChapter.remark,
                                cover: CreateChapter.cover,
                                pid: CreateChapter.pid
                             }).execute();
    return result;
  }

  public async UpdateChapterById(UpdateChapter: ChapterUpdateDTO): Promise<UpdateResult> {

    const result = await this.ChapterRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                name: UpdateChapter.data.name,
                                remark: UpdateChapter.data.remark,
                                cover: UpdateChapter.data.cover,
                                pid: UpdateChapter.data.pid,
                                course: {
                                  id: UpdateChapter.data.course
                                }
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateChapter.id)
                             .execute();
    return result;
  }

  //通过id 删除 菜单
  public async DeleteChapterById(id: number) {
    //创建事务
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      //先删除 pid = id 的 子菜单
      await this.ChapterRepository
                .createQueryBuilder(null, queryRunner)
                .delete()
                .where("pid = :id")
                .setParameter("id", id)
                .execute();

      const DeleteResult = await this.ChapterRepository
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

  public async Total() : Promise<number> {
    return await this.ChapterRepository
                                     .createQueryBuilder()
                                     .select()
                                     .where("pid IS NULL")
                                     .getCount();
  }

  public async getChapterByCourseId(courseId: number) : Promise<StuChapter[]> {
    return await this.ChapterRepository
                    .createQueryBuilder()
                    .select()
                    .where("course = :courseId")
                    .setParameter("courseId", courseId)
                    .getMany();
  }
}
