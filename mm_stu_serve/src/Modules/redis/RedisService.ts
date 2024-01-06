import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis, RedisKey } from "ioredis";


@Injectable()
export class RedisService {

  constructor(
    @InjectRedis() private readonly RedisRepository: Redis,
  ){}

  public async setKV(key : RedisKey, value: string | Buffer | number ) {
    return new Promise((resolve, reject) => {
      try {
        this.RedisRepository.set(key, value);
        resolve(undefined);
      } catch (error) {
        reject(error);
      }
    })
  }

  public async getKV(key: RedisKey): Promise<string> {
    return new Promise((resolve, reject) => {
      this.RedisRepository.get(key).then(resolve, reject);
    });
  }
}