import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGameRoomDto } from './dto/create-game-room.dto';
import { JoinGameRoomDto } from './dto/join-game-room.dto';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { TatetiService } from './tateti.service';
import Redis from 'ioredis';
/*
este controller se encarga de recibir peticiones http
solo crea y permite unirnos a las rooms
nos devuelve nuestras credenciales del juego
*/
@UsePipes(new ValidationPipe())
@Controller('tateti')
export class TatetiController {
  constructor(
    private tatetiService: TatetiService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  @Get()
  pingRedis() {
    return this.redis.ping();
  }

  @Post('create')
  createGameRoom(
    @Body() createGameRoomDto: CreateGameRoomDto,
  ): NewPlayerDataDto {
    return this.tatetiService.createGameRoom(createGameRoomDto);
  }

  @Post('join')
  joinGameRoom(@Body() joinGameRoomDto: JoinGameRoomDto): NewPlayerDataDto {
    try {
      return this.tatetiService.joinGameRoom(joinGameRoomDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
