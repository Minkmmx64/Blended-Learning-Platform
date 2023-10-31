import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { TokenDTO } from "src/Modules/common/common.dto";
import * as fs from "fs";
import * as path from "path"
const algorithm = "aes-256-cbc";
// generate 16 bytes of random data
//const initVector = crypto.randomBytes(16);
// secret key generate 32 bytes of random data
//const Securitykey = crypto.randomBytes(32);
const initVectorPath = path.join(__dirname, "iv.txt");
const SecuritykeyPath = path.join(__dirname, "iv.txt");

const getBuffer = (path : string) : Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const rfs = fs.createReadStream(path);
    let data = "";
    rfs.on("open", () => {
      rfs.on("data", (e : string) => {
        data += e;
      });
      rfs.on("close", () => {
        rfs.close();
        resolve(Buffer.from(data));
      })
    })
    rfs.on("error", e => reject(e));
  });
}

// 加密数据
export const encryption = async (msg: string) : Promise<string> => {
  const initVector = await getBuffer(initVectorPath);
  const Securitykey = await getBuffer(SecuritykeyPath);
  fs.writeFileSync(initVectorPath, crypto.randomBytes(16).toString());
  console.log(initVector, crypto.randomBytes(16));
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(msg, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}
//解密
export const uncryption = async (data : string) : Promise<string> => {
  const initVector = await getBuffer(initVectorPath);
  const Securitykey = await getBuffer(SecuritykeyPath);
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedData = decipher.update(data, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

//Token处理
export const JWT = {
  secret: "mjw",
  genToken: (data : TokenDTO) => jwt.sign(data, JWT.secret),
  verify: (token : string) => jwt.verify(token, JWT.secret)
}