import { TatetiModule } from './tateti/tateti.module';
import { RedisModule } from './redis/redis.module';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [RedisModule, TatetiModule, MikroOrmModule.forRoot()],
})
export class AppModule {}
