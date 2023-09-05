import { FactoryProvider } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'REDIS',
  useFactory: (options: RedisOptions) => {
    return new Redis({ port: 6379, host: 'redis' });
  },
};
