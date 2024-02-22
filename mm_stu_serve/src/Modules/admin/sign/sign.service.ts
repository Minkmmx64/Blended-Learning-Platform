import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { SignDAO } from "./sign.dao";
import { SignCreateDTO, SignUpdateDTO, SignQueryDTO, SignBase } from "./sign.dto";
import { StuSign } from "src/Entity/stu_sign.entity";
import { StuDAO } from "../stu/stu.dao";
import { RedisService } from "src/Modules/redis/RedisService";
import { SignCreate } from "src/Modules/ws/webSocket.type";


@Injectable()
export class SignService{
  constructor(
    private readonly DataSource: DataSource,
    private readonly StuDAO: StuDAO,
    private readonly RedisService: RedisService
  ){}

  public SignDAO = new SignDAO(this.DataSource); 

  // public async SignListsPagination(SignQuery: PaginationQuery<SignQueryDTO>): ServiceData<ListMetaData<StuSign[]>> {
  //   try {
  //     const Signs = await this.SignDAO.SignListsPagination(SignQuery);
  //     const res: ListMetaData<StuSign[]> = {
  //       list: Signs,
  //       meta: {
  //         total: await this.SignDAO.Total()
  //       }
  //     }
  //     return [ null, res ];
  //   } catch (error) {
  //     return [ new Error(error), null];
  //   }
  // }

  public async SignCreate(SignCreate: SignCreateDTO) : ServiceData<number>{
    try {
      const result = await this.SignDAO.CreateSign(SignCreate);
      /**
       * 获取该班级所有学生
       */
      const students = await this.StuDAO.getStudentsByClassId(SignCreate.classId);
      
      /**
       * 插入学生_签到列表中
       */
      await this.SignDAO.addUserSignRecord(students.map( v => v.id), result.identifiers[0].id);
      const sign = result.identifiers[0].id;
      return [ null, sign ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async SignTTL(body: SignBase) : ServiceData<{ ttl: number, id: number }> {
    try {
      const key = `${body.teacherId}-${body.classId}-${body.courseId}`;
      const ttl = await this.RedisService.getTTL(key);
      const res = await this.RedisService.getKV('@' + key);
      return [ null, { ttl: ttl, id: parseInt(res) } ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  // public async SignUpdate(SignUpdate : SignUpdateDTO) : ServiceData<UpdateResult>{
  //   try {
  //     const UpdateResult = await this.SignDAO.UpdateSignById(SignUpdate);
  //     return [ null, UpdateResult ];
  //   } catch (error) {
  //     return [new Error(error), null];
  //   }
  // }

  // public async SignDelete(id: number) : ServiceData<DeleteResult> {
  //   try {
  //     const DeleteResult = await this.SignDAO.DeleteSignById(id);
  //     return [ null, DeleteResult ];
  //   } catch (error) {
  //     return [new Error(error), null];
  //   }
  // }
}