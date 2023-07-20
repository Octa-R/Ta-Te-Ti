import { Module, ValidationPipe } from '@nestjs/common';
import { TatetiGateway } from './tateti/tateti.gateway';
import { TatetiController } from './tateti/tateti.controller';
import { Tateti } from './tateti/tateti';
import { TatetiService } from './tateti/tateti.service';

@Module({
  imports: [],
  controllers: [TatetiController],
  providers: [TatetiGateway, Tateti, TatetiService],
})
export class AppModule {}
