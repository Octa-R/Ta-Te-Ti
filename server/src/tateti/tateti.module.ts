import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { TatetiController } from './tateti.controller';
import { TatetiGateway } from './tateti.gateway';
import { TatetiService } from './tateti.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [RedisModule, TatetiModule],
  controllers: [TatetiController],
  providers: [TatetiGateway, TatetiService, RedisService],
})
export class TatetiModule {}
