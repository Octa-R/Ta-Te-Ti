import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'REDIS',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      port: configService.get('REDIS_PORT'),
      host: configService.get('REDIS_HOST'),
    });
  },
  inject: [ConfigService],
};
