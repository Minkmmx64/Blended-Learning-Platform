import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { TokenDTO } from "src/Modules/common/common.dto";
const algorithm = "aes-256-cbc";

const initVectorBufferData = [
  147, 112,  55,  21, 19, 201,
   59, 166, 225, 195,  9,  34,
  233, 216,  90,  24
];

const SecuritykeyBufferData = [
  118,  64, 101, 137, 127, 219,  94,
  133, 104,  38,  60, 151, 132, 217,
  234, 175,  55, 216, 226, 146,  84,
    7, 108, 124, 174,  94,  66, 211,
  129, 238, 150, 168
]

const Securitykey = Buffer.from(SecuritykeyBufferData);
const initVector = Buffer.from(initVectorBufferData);
// 加密数据
export const encryption = (msg: string) : string => {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(msg, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

//解密
export const uncryption = (data : string) : string => {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector );
  let decryptedData = decipher.update(data, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

//Token处理
export const JWT = {
  secret: "mjw",
  genToken: (data : TokenDTO, expires?: string) => jwt.sign(data, JWT.secret, {
    expiresIn: expires ?? "1h"
  }),
  verify: (token : string) => jwt.verify(token, JWT.secret)
}