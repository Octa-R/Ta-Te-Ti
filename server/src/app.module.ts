import { TatetiModule } from './tateti/tateti.module';
import { RedisModule } from './redis/redis.module';
import { Module, ValidationPipe } from '@nestjs/common';

@Module({
  imports: [RedisModule, TatetiModule],
})
export class AppModule {}
