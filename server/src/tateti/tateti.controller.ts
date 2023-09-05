import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGameRoomDto } from './dto/create-game-room.dto';
import { JoinGameRoomDto } from './dto/join-game-room.dto';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { TatetiService } from './services/tateti.service';
import Redis from 'ioredis';
import { ConnectionsService } from './services/connections.service';
/*
este controller se encarga de recibir peticiones http
solo crea y permite unirnos a las rooms
nos devuelve nuestras credenciales del juego
*/
@UsePipes(new ValidationPipe())
@Controller('tateti')
export class TatetiController {
  private readonly logger = new Logger(TatetiController.name);
  constructor(
    private tatetiService: TatetiService,
    @Inject('REDIS') private readonly redis: Redis,
    private conn: ConnectionsService,
  ) {}

  @Get()
  pingRedis() {
    return this.redis.ping();
  }
  /*
    este enpoint sirve para dar de alta una nueva game_room
  */
  @Post('create')
  async createGameRoom(
    @Body() createGameRoomDto: CreateGameRoomDto,
  ): Promise<NewPlayerDataDto> {
    try {
      return await this.tatetiService.createGameRoom({ ...createGameRoomDto });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
  /*
    este enpoint sirve para unirse a una game_room previamente creada
  */
  @Post('join')
  async joinGameRoom(
    @Body() joinGameRoomDto: JoinGameRoomDto,
  ): Promise<NewPlayerDataDto> {
    try {
      const { roomId } = joinGameRoomDto;
      const gameId = await this.conn.getGameIdByRoom(roomId);
      return await this.tatetiService.joinGameRoom({
        ...joinGameRoomDto,
        gameId,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
