import moment from "moment";

export class DataModules {

  public id = 0;

  public create_time = moment().format("YYYY-MM-DD");
 
  public update_time = moment().format("YYYY-MM-DD");

  public status?: boolean;

  public remark?: string;

  public pid?: number;

  public index?: number;

}