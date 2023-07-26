import { Module, ValidationPipe } from '@nestjs/common';
import { TatetiGateway } from './tateti/tateti.gateway';
import { TatetiController } from './tateti/tateti.controller';
import { TatetiService } from './tateti/tateti.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from './redis/redis.module';
import { TatetiModule } from './tateti/tateti.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [RedisModule, TatetiModule],
  controllers: [TatetiController],
  providers: [TatetiGateway, TatetiService, RedisService],
})
export class AppModule {}
