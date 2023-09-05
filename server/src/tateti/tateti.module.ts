import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { TatetiController } from './tateti.controller';
import { TatetiGateway } from './tateti.gateway';
import { TatetiService } from './services/tateti.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Player } from './entities/player.entity';
import { Game } from './entities/game.entity';
import { ConnectionsService } from './services/connections.service';
import { redisClientFactory } from 'src/redis/redis-client.factory';

@Module({
  imports: [RedisModule, MikroOrmModule.forFeature([Game, Player])],
  controllers: [TatetiController],
  providers: [
    TatetiGateway,
    TatetiService,
    ConnectionsService,
    redisClientFactory,
  ],
})
export class TatetiModule {}
