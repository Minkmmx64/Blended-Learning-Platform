import * as JPush from "jpush-async/lib/JPush/JPushAsync.js";

const client = JPush.buildClient('f6fed4a0c36a707509baab3d', '85efce9a80e2374c54168850');

export const broadCastForDevices = (broadTitle: string, broadContent: string,  devices: string[]) => {
  return new Promise((resolve, reject) => {
    client.push()
          .setPlatform(JPush.ALL)
          .setAudience(JPush.registration_id(devices))
          .setNotification(
            JPush.android(
              broadContent, 
              broadTitle, 
            )
          )
          .send()
          .then(result => { resolve(result); })
          .catch(err => { reject(err); })
  });
}

export const broadCastForAlias = <T = any>(
  broadTitle: string, 
  broadContent: string,  
  alias: string[], 
  extras?: T
) => {
  return new Promise((resolve, reject) => {
    client.push()
          .setPlatform(JPush.ALL)
          .setAudience(JPush.alias(alias))
          .setNotification(
            JPush.android(
              broadContent, 
              broadTitle, 
              1,
              extras
            )
          )
          .send()
          .then(result => { resolve(result); })
          .catch(err => { reject(err); })
  });
}