import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  public constructor(@Inject('REDIS') private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.quit();
  }

  ping() {
    return this.redis.ping();
  }
}
