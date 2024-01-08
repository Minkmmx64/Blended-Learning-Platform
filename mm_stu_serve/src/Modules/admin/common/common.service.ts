import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { JWT } from "src/utils/crypto";
import { svgCode } from "src/utils/sms";
import { IFileUploadStart, IFileisExist, RedisFileSliceData, TokenDTO } from "./common.dto";
import { Express } from 'express'
import { ReadFile } from "src/common/common";
import * as path from "path";
import { Rules } from "src/utils/regex";
import * as fs from "node:fs";
import * as dotenv from "dotenv";
import * as worker_threads from "worker_threads";
import { RedisService } from "src/Modules/redis/RedisService";
import { DataSource } from "typeorm";
import { CommonDao } from "./common.dao";

@Injectable()
export class CommonService {

  private filePath: string = path.join(__dirname, "..", "..", "..", "static", "file");

  private imagePath: string = path.join(__dirname, "..", "..","..", "static", "image");

  private fileCreateWorkPath: string = path.join(__dirname, "./file_slice_create_work_thread.js");

  private fileMergeWorkPath: string = path.join(__dirname, "./file_slice_merge_work_thread.js");

  constructor(
    private readonly RedisService: RedisService,
    private readonly DataSource: DataSource
  ) {}

  private CommonDao = new CommonDao(this.DataSource); 

  public async getSmsCode(session: Record<string, any>) : Promise<string> {
    const svg = svgCode({ height: 40 });
    session.sms = svg.text;
    return svg.data;
  }

  public async vSmsCode(code: string, session: Record<string, any>) : Promise<boolean> {
    try {
      const sms = session.sms as string;
      return code.toLowerCase() === sms.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  public vToken(token: string) {
    return JWT.verify(token);
  }

  public rToken(Authorization: string) : [Error, string] {
    const [ error, verify ] = JWT.verify(Authorization);
    if(error) {
      if(error === "TokenExpiredError: jwt expired") {
        const deToken = JWT.decode(Authorization) as TokenDTO;
        //过期了先解包里面的用户数据，如权限id
        const token = JWT.genToken({
          uuid: randomUUID(),
          skey: JWT.secret,
          role: deToken.role
        });
        return [ null, token ];
      } else return [ new Error("用户信息无效") , null ];
    }

    return [ null, Authorization ];
  }

  public async FileUpload(file : Express.Multer.File): Promise<[Error, string]> {
    dotenv.config();
    try {
      const md5 = await ReadFile(file);
      const fileSuff = Rules.suff.rule.exec(file.originalname)[0];
      const fileName = `${md5}.${fileSuff}`;
      const filePath = path.join(this.imagePath, fileName);
      fs.writeFileSync(filePath,file.buffer, { flag: "w+" });
      return [ null, `http://${process.env.SERVER_HOST}:8080/image/` + md5 + "." + fileSuff ];
    } catch (error) {
      return [new Error(error), null]; 
    }
  }

  public async FileUploadStart(md5: string, filename: string) : Promise<[Error, IFileUploadStart | IFileisExist ]> {
    try {
      //先看看数据库文件是否已经存在
      const exist = await this.CommonDao.getFileByMd5(md5);
      if(exist) {
        return [ null, { exist: exist } ];
      }
      const MD5FilePath = path.join(this.filePath, md5);
      /**
       * 获取文件后缀名
       * 判断该md5文件夹下的文件数量，比对判断文件是否上传完整
       */
      const fileSuff = Rules.suff.rule.exec(filename)[0];
      const unSerializeData = await this.RedisService.getKV(md5);
      let SerializeData = undefined as RedisFileSliceData;
      if(unSerializeData) {
        SerializeData = JSON.parse(unSerializeData) as RedisFileSliceData;
        SerializeData.number = SerializeData.number + 1;
      } else {
        SerializeData = {
          suf: fileSuff,
          number: 0
        }
        await this.RedisService.setKV(md5, JSON.stringify(SerializeData));
      }
      try {
        fs.opendirSync(MD5FilePath);
      } catch (error) {
        fs.mkdirSync(MD5FilePath);
      }
      const result: IFileUploadStart = {
        md5: md5,
        chunk: SerializeData.number
      }
      return [ null, result ];
    } catch (error) {
      return [new Error(error), null]; 
    }
  }

  public run(file : Express.Multer.File, number: number, md5: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const main_thread = new worker_threads.Worker(this.fileCreateWorkPath, {
        workerData: {
          dirname: md5,
          file: file.buffer,
          number: number
        }
      });
      main_thread.on("message", async () => {
        //console.log("创建分片文件完成::",value);
        //将当前文件传输信息存储到redis
        const unSerializeData = await this.RedisService.getKV(md5);
        let SerializeData = JSON.parse(unSerializeData) as RedisFileSliceData;
        SerializeData.number = Math.max(SerializeData.number, number);
        await this.RedisService.setKV(md5, JSON.stringify(SerializeData));
        //main_thread.terminate();
        resolve("ok");
      });
      main_thread.on("error", error => {
        console.error("创建分片文件失败::",error)
        reject(error);
      });
    })
  }

  public async FileUploadSlice(file : Express.Multer.File, number: number, md5: string) : Promise<[Error, string]> {
    try {
      //新建工作线程执行文件创建
      const data = await this.run(file, number, md5);
      return [ null, data ];
    } catch (error) {
      return [new Error(error), null];
    }
  }

  public async MergeFile(filename: string) : Promise<[Error, { url: string, type: string }]> {
    try {
      //通过缓存查找文件
      const unSerializeData = await this.RedisService.getKV(filename);
      //删除缓存
      await this.RedisService.rmKV(filename);
      const SerializeData = JSON.parse(unSerializeData) as RedisFileSliceData;
      // 合并文件
      const main_thread = new worker_threads.Worker(this.fileMergeWorkPath, {
        workerData: {
          entry_dir: this.filePath,
          out_dir: this.filePath,
          out_name: filename,
          file_suffix: SerializeData.suf,
          slice_count: SerializeData.number + 1
        }
      });
      main_thread.on("message", e => {
        console.log("data::", e);
      });
      main_thread.on("error", e => {
        //如果错误，删除该文件相关的所有数据
        console.log("error::", e.message);
      });
      const resultPath = `http://${process.env.SERVER_HOST}:8080/file/` +  filename + "." + SerializeData.suf;
      try {
        //将该文件路径以及md5写进文件数据库，后面实现秒传
        await this.CommonDao.insertStuFileResource({
          md5: filename,
          type: SerializeData.suf,
          src: resultPath
        });
      } catch (error) {
        console.log("文件已存在", error);
      }
      return [ null, { url: resultPath, type: SerializeData.suf } ];
    } catch (error) {
      return [new Error(error), null]; 
    }
  }
}