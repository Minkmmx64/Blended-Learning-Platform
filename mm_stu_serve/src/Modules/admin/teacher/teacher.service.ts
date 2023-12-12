import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { TeacherDAO } from "./teacher.dao";
import { TeacherCreateDTO, TeacherUpdateDTO, TeacherQueryDTO, RealCourseDTO } from "./teacher.dto";
import { StuTeacher } from "src/Entity/stu_teacer.entity";
import * as pinyin from "pinyin";

@Injectable()
export class TeacherService{
  constructor(private readonly DataSource: DataSource){}

  public TeacherDAO = new TeacherDAO(this.DataSource); 

  public async TeacherListsPagination(TeacherQuery: PaginationQuery<TeacherQueryDTO>): ServiceData<ListMetaData<StuTeacher[]>> {
    try {
      const Teachers = await this.TeacherDAO.TeacherListsPagination(TeacherQuery);
      const res: ListMetaData<StuTeacher[]> = {
        list: Teachers,
        meta: {
          total: await this.TeacherDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async TeacherCreate(TeacherCreate: TeacherCreateDTO) : ServiceData<InsertResult>{
    try {
      const name = pinyin(TeacherCreate.name, {
        style: pinyin.STYLE_FIRST_LETTER
      }).join("")
      const code = "13280" + name + (Math.floor(Math.random() * 998244353) % 10000).toString();
      TeacherCreate.code = code;
      const result = await this.TeacherDAO.CreateTeacher(TeacherCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async TeacherUpdate(TeacherUpdate : TeacherUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const name = pinyin(TeacherUpdate.data.name, {
        style: pinyin.STYLE_FIRST_LETTER
      }).join("")
      const code = "13280" + name + (Math.floor(Math.random() * 998244353) % 10000).toString();
      TeacherUpdate.data.code = code;
      const UpdateResult = await this.TeacherDAO.UpdateTeacherById(TeacherUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async TeacherDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.TeacherDAO.DeleteTeacherById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async RealCourse( RealCourse :RealCourseDTO) : ServiceData<void> {
    try {
      await this.TeacherDAO.RealCourse(RealCourse);
      return [ null,  (void 0) ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}