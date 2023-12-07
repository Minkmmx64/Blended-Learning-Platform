import moment from "moment";

export class DataModules {

  public id = 0;

  public create_time = moment().format("YYYY-MM-DD");
 
  public update_time = moment().format("YYYY-MM-DD");

  public status?: boolean;

  public remark?: string;

  public pid?: number;

  public index?: number;

  public serviceKey = {
    
  }

  public clientKey = {

  }

  public transformServiceDataToClient(serviceKey: string,  serviceData: Record<string, any>) {
    // 服务端到客户端key的映射
    // class_id = { type : "object", deep : "class.id" }  表示客户端的class_id 字段依赖于 且 服务端serviceKey是object类型 serviceData.class.id
    if(this.clientKey[serviceKey]) {
      if(this.clientKey[serviceKey].type === "object") {
        let data = serviceData;
        (this.clientKey[serviceKey].deep as string).split(".").map( k => data = data[k]);
        return data;
      } else if(this.clientKey[serviceKey].type === "array") {
        try {
          const data = (serviceData[serviceKey] as string).split(this.clientKey[serviceKey].deep);
          return data;
        } catch (error) {
          console.log(error);
        }
      }
    } 

    return serviceData[serviceKey];
  }

  public transformClientDataDataToServer(clientKey: string,  clientData: Record<string, any>) {
    if(this.serviceKey[clientKey]) {
      //判断 this.serviceKey[clientKey] 将 clientData[clientKey] 转换成 this.serviceKey[clientKey] 的类型
      if(typeof this.serviceKey[clientKey].type === "string") {
        if(typeof clientData[clientKey]["toString"] === "function") {
          return clientData[clientKey].toString();
        } else {
          throw "该对象不包含 toString不能转化成字符串";
        }
      }
    }

    return clientData[clientKey];
  }
}