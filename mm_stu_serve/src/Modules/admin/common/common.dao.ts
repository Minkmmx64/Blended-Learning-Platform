import { Injectable } from "@nestjs/common";
import { StuFileResource } from "src/Entity/stu_file_resource.entity";
import { DataSource, InsertResult } from "typeorm";


@Injectable()
export class CommonDao {
  constructor(protected DataSource: DataSource){}

  public FileRepository = this.DataSource.getRepository(StuFileResource);

  public async getFileByMd5(md5: string) :Promise<StuFileResource> {
    return this.FileRepository.createQueryBuilder()
                              .select()
                              .where("md5 = :md5")
                              .setParameter("md5", md5)
                              .getOne();
  }
  
  public async insertStuFileResource(data: Partial<StuFileResource>) : Promise<InsertResult> {
    return this.FileRepository.createQueryBuilder()
                              .insert()
                              .values(data)
                              .execute();
  }
}