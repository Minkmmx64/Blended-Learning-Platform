import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { ChapterDAO } from "./chapter.dao";
import { ChapterCreateDTO, ChapterUpdateDTO, ChapterQueryDTO } from "./chapter.dto";
import { StuChapter } from "src/Entity/stu_chapter.entity";

@Injectable()
export class ChapterService{
  constructor(private readonly DataSource: DataSource){}

  public ChapterDAO = new ChapterDAO(this.DataSource); 

  public async ChapterListsPagination(ChapterQuery: PaginationQuery<ChapterQueryDTO>): ServiceData<ListMetaData<StuChapter[]>> {
    try {
      const Chapters = await this.ChapterDAO.ChapterListsPagination(ChapterQuery);
      const res: ListMetaData<StuChapter[]> = {
        list: Chapters,
        meta: {
          total: await this.ChapterDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async ChapterCreate(ChapterCreate: ChapterCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.ChapterDAO.CreateChapter(ChapterCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async ChapterUpdate(ChapterUpdate : ChapterUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.ChapterDAO.UpdateChapterById(ChapterUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async ChapterDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.ChapterDAO.DeleteChapterById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}