import { Module, ValidationPipe } from '@nestjs/common';
import { TatetiGateway } from './tateti/tateti.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [TatetiGateway],
})
export class AppModule {}
