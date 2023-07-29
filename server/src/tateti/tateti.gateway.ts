import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationExceptionFilter } from './exceptions/exception.filter';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import { GameSocket } from './interfaces';
import { instanceToPlain } from 'class-transformer';
import { Namespace } from 'socket.io';
import { TatetiService } from './tateti.service';
import { JoinGameRoomDto } from './dto/join-game-room.dto';
import { Redis } from 'ioredis';
import { Game } from './models/game.model';
import { ConnectToGameDto } from './dto/connectToGame.dto';
/*
este gateway devuelve el estado del juego ante cualquier cambio
para poder unirse a una gameroom
hay que tener las credenciales necesarias
usando el mensaje join el servidor nos va a unir a la game room
*/
@UseFilters(new ValidationExceptionFilter())
// @UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
export class TatetiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  io: Namespace;

  private readonly logger = new Logger(TatetiGateway.name);

  //se mapea cada socketId con un roomId asi cuando
  // el socket se desconecta se puede avisar a la room
  playerRoom = [];
  connectedUsersKey = 'connected_users';

  constructor(
    @Inject('REDIS') private redis: Redis,
    private tatetiService: TatetiService,
  ) {}

  afterInit(): void {
    this.logger.log('Websocket gateway Initialized');
  }

  handleConnection(socket: GameSocket) {
    this.logger.log(`WS client with id: ${socket.id} connected!`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  async handleDisconnect(socket: GameSocket) {
    this.logger.log(`Disconnected socket with id: ${socket.id}`);

    const playerRoomId = await this.redis.hget(
      this.connectedUsersKey,
      socket.id,
    );

    this.logger.debug(`se encontro la room ${playerRoomId}`);
    if (playerRoomId) {
      await this.redis.hdel(this.connectedUsersKey, socket.id);
    }

    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  // este mensaje se manda para que socket.io conecte el jugador a la room
  // antes cad jugador debe haber obtenido sus credenciales
  // en los endpoints http
  @SubscribeMessage('room::game::join')
  async connectToGame(
    @MessageBody() connectToGame: ConnectToGameDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const { roomId, playerId } = connectToGame;

    const gameState = this.tatetiService.getGameRoomById(roomId);

    if (!gameState) {
      this.logger.warn('la room no existe');
      return;
    }

    gameState.connect({ playerId, socketId: socket.id });

    this.logger.debug(`se une el socket ${socket.id} a la room ${roomId}`);
    socket.join(roomId);
    //guarda a que room se conecto el user
    await this.redis.hset(this.connectedUsersKey, socket.id, roomId);

    this.io.to(roomId).emit('room::game::state', instanceToPlain(gameState));
    return {
      message: 'ok',
      ok: true,
    };
  }

  @SubscribeMessage('room::game::move')
  makeMove(
    @MessageBody() moveToGame: MoveToGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const { roomId } = moveToGame;
    try {
      const gameState: Game = this.tatetiService.moveToGame(moveToGame);
      this.logger.debug(
        `se hizo la jugada, este es el estado de la partida ${JSON.stringify(
          gameState.board,
        )}`,
      );
      this.io.to(roomId).emit('room::game::state', instanceToPlain(gameState));
      return {
        message: 'played succesfully',
        ok: true,
      };
    } catch (error) {
      this.logger.error(error);
      this.io.to(roomId).emit('exception', error.message);
      return {
        message: error.message,
        ok: false,
      };
    }
  }
}
