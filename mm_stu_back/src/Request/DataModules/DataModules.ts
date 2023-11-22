import moment from "moment";

export class DataModules {
  
  public id: number = 0;

  public create_time: string = moment().format("YYYY-MM-DD");
 
  public update_time: string = moment().format("YYYY-MM-DD");

  public status: boolean = true;;

  public remark: string = "";

}