import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { Redis, RedisKey } from "ioredis";


@Injectable()
export class RedisService {

  constructor(
    @InjectRedis() private readonly RedisRepository: Redis,
  ){}

  public async setKV(key : RedisKey, value: string | Buffer | number ) {
    this.RedisRepository.set(key, value);
  }
}