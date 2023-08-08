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

    const data = await this.redis.hget(this.connectedUsersKey, socket.id);
    if (!data) {
      this.logger.error('no se encontro la room para ese socket');
      return;
    }
    const { roomId, playerId } = JSON.parse(data);

    this.logger.debug(`el socket se desconecto de la room`, roomId, playerId);
    if (!roomId || !playerId) {
      this.logger.debug('se rompio, no hay player ni roomId');
    }
    await this.redis.hdel(this.connectedUsersKey, socket.id);
    const game = await this.tatetiService.playerDisconnect({
      roomId,
      playerId,
    });
    const gameState = instanceToPlain(game);
    this.logger.debug(`se va a enviar esto ${JSON.stringify(gameState)}`);
    this.io.to(roomId).emit('room::game::state', gameState);

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
    try {
      const gameState: Game = await this.tatetiService.playerEnterGameRoom(
        connectToGame,
      );
      //asocia el socketId conectado con el PlayerId y su roomId
      this.redis.hset(
        this.connectedUsersKey,
        socket.id,
        JSON.stringify({ playerId, roomId }),
      );
      //se une el socket a la room
      socket.join(roomId);
      this.logger.debug(`se une el socket ${socket.id} a la room ${roomId}`);

      this.io.to(roomId).emit('room::game::state', instanceToPlain(gameState));
      return {
        message: 'game room joined succesfuly',
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

  @SubscribeMessage('room::game::move')
  async makePlayerMove(
    @MessageBody() moveToGame: MoveToGameDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const { roomId } = moveToGame;
    try {
      const gameState: Game = await this.tatetiService.moveToGame(moveToGame);
      this.logger.debug(
        `nuevo estado de la partida ${JSON.stringify(gameState.board)}`,
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

  @SubscribeMessage('room::game::play_again')
  async playAgain(
    @MessageBody() playAgain: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const { roomId, playerId } = playAgain;
    try {
      const gameState: Game = await this.tatetiService.playAgain(playAgain);
      this.logger.debug(
        `el jugador con id${playerId} quiere jugar de vuelta en la room ${roomId}`,
      );
      this.io.to(roomId).emit('room::game::state', instanceToPlain(gameState));
      return {
        message: 'play again',
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
