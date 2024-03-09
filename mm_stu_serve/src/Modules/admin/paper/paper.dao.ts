import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { PaperCreateDTO, PaperQueryDTO, PaperUpdateDTO } from "./paper.dto";
import { ToOrder } from "src/common/common";
import { StuPaper } from "src/Entity/stu_paper.entity";
import { StuSubject } from "src/Entity/stu_subject.entity";

export class PaperDAO {
  constructor(protected DataSource: DataSource){}

  public PaperRepository = this.DataSource.getRepository(StuPaper);

  public async PaperListsPagination(PaperQuery: PaginationQuery<PaperQueryDTO>): Promise<StuPaper[]> {

    const Order = ToOrder(PaperQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuPaper> = this.PaperRepository.createQueryBuilder().select();

    if(PaperQuery.prop) {
      SelectQueryBuilder
                        .orderBy(PaperQuery.prop, Order)
    }

    if(PaperQuery.classify) {
      SelectQueryBuilder
                        .andWhere("classify LIKE :classify")
                        .setParameter("classify", `%${PaperQuery.classify}%`);
    }

    if(PaperQuery.name) {
      SelectQueryBuilder
                        .andWhere("name LIKE :name")
                        .setParameter("name", `%${PaperQuery.name}%`);
    }

    if(PaperQuery.teacher_id) {
      SelectQueryBuilder
                        .andWhere("teacher_id = :teacher_id")
                        .setParameter("teacher_id", PaperQuery.teacher_id);
    }

    return await SelectQueryBuilder
                                   .skip(PaperQuery.limit * (PaperQuery.offset - 1))
                                   .take(PaperQuery.limit)
                                   .getMany();
  }

  public async CreatePaper(CreatePaper: PaperCreateDTO): Promise<InsertResult> {

    const result = await this.PaperRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuPaper)
                             .values({
                                remark: CreatePaper.remark,
                                classify: CreatePaper.classify,
                                name: CreatePaper.name,
                                teacher: {
                                  id: CreatePaper.teacher_id
                                },
                                total: CreatePaper.total ?? 0
                             }).execute();
    return result;
  }

  public async UpdatePaperById(UpdatePaper: PaperUpdateDTO): Promise<UpdateResult> {

    const result = await this.PaperRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                remark: UpdatePaper.data.remark,
                                classify: UpdatePaper.data.classify,
                                name: UpdatePaper.data.name,
                                total: UpdatePaper.data.total
                             })
                             .where("id = :id")
                             .setParameter("id", UpdatePaper.id)
                             .execute();
    return result;
  }

  public async DeletePaperById(id: number) : Promise<DeleteResult> {

    const result = await this.PaperRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.PaperRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }


  public async DeletePaperSubjectRelaById(paperId: number, subjectIdxs: number[]) {
    const queryRunner = this.DataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const old_subjects = await this.PaperRepository
                                 .createQueryBuilder("paper", queryRunner)
                                 .relation(StuPaper, "subjects")
                                 .of(paperId)
                                 .loadMany<StuSubject>();
      
      await this.PaperRepository
                .createQueryBuilder("paper", queryRunner)
                .relation(StuPaper, "subjects")
                .of(paperId)
                .remove(old_subjects);
      
      await this.PaperRepository
                .createQueryBuilder("paper", queryRunner)
                .relation(StuPaper, "subjects")
                .of(paperId)
                .add(subjectIdxs)
      
      const new_subjects = await this.PaperRepository
                                     .createQueryBuilder("paper", queryRunner)
                                     .relation(StuPaper, "subjects")
                                     .of(paperId)
                                     .loadMany<StuSubject>();

      await queryRunner.commitTransaction();
      
      return new_subjects;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async getRelaPaperSubjectsById(paperId: number) {

    return await this.PaperRepository
                     .createQueryBuilder("paper")
                     .relation(StuPaper, "subjects")
                     .of(paperId)
                     .loadMany<StuSubject>();

  }
}
