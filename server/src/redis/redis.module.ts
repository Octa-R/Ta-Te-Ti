import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';

@Module({
  providers: [redisClientFactory],
  exports: ['REDIS'],
})
export class RedisModule {}
