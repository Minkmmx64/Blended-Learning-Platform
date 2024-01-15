
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { ListMetaData, PaginationQuery, ServiceData } from "../../index.type";
import { resourceDAO } from "./resource.dao";
import { resourceCreateDTO, resourceUpdateDTO, resourceQueryDTO } from "./resource.dto";
import { StuCourseResource } from "src/Entity/stu_course_resource.entity";

@Injectable()
export class resourceService{
  constructor(private readonly DataSource: DataSource){}

  public resourceDAO = new resourceDAO(this.DataSource); 

  public async resourceListsPagination(resourceQuery: PaginationQuery<resourceQueryDTO>): ServiceData<ListMetaData<StuCourseResource[]>> {
    try {
      const resources = await this.resourceDAO.resourceListsPagination(resourceQuery);
      const res: ListMetaData<StuCourseResource[]> = {
        list: resources,
        meta: {
          total: await this.resourceDAO.Total()
        }
      }
      return [ null, res ];
    } catch (error) {
      return [ new Error(error), null];
    }
  }

  public async resourceCreate(resourceCreate: resourceCreateDTO) : ServiceData<InsertResult>{
    try {
      const result = await this.resourceDAO.Createresource(resourceCreate);
      return [ null, result ];
    } catch (error) {
      return [ new Error(error) , null ]
    }
  }

  public async resourceUpdate(resourceUpdate : resourceUpdateDTO) : ServiceData<UpdateResult>{
    try {
      const UpdateResult = await this.resourceDAO.UpdateresourceById(resourceUpdate);
      return [ null, UpdateResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async resourceDelete(id: number) : ServiceData<DeleteResult> {
    try {
      const DeleteResult = await this.resourceDAO.DeleteresourceById(id);
      return [ null, DeleteResult ];
    } catch (error) {
      return [new Error(error), null];
    }
  }
}