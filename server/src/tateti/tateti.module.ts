import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { TatetiController } from './tateti.controller';
import { TatetiGateway } from './tateti.gateway';
import { TatetiService } from './tateti.service';

@Module({
  imports: [RedisModule],
  controllers: [TatetiController],
  providers: [TatetiGateway, TatetiService],
})
export class TatetiModule {}
