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
import { ClientProxy } from '@nestjs/microservices';
import { RedisClient } from 'ioredis/built/connectors/SentinelConnector/types';
import { Redis } from 'ioredis';
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

  // players: Map<string, string> = new Map();
  //se mapea cada socketId con un roomId asi cuando
  // el socket se desconecta se puede avisar a la room
  playerRoom = [];

  constructor(
    private tatetiService: TatetiService,
  ) // @Inject('REDIS_SERVICE') private redis: Redis,
  {
    // this.redis.hset('key', { name: 'octa' });
  }

  afterInit(): void {
    this.logger.log('Websocket gateway Initialized');
  }

  handleConnection(socket: GameSocket) {
    this.logger.log(`WS client with id: ${socket.id} connected!`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  handleDisconnect(socket: GameSocket) {
    this.logger.log(`Disconnected socket with id: ${socket.id}`);
    // console.log(socket);
    // this.logger.debug(socket.id, JSON.stringify(this.playerRoom));
    const room = this.playerRoom.find((elem) => elem.socketId === socket.id);
    if (room) {
      this.logger.debug(
        `el socketid: ${room.socketId} se desconecto de la room ${room.roomId}`,
      );
      const quit = { roomId: room.roomId, socketId: room.socketId };
      this.logger.debug(quit);
      this.tatetiService.quitGame(quit);
    }

    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  // este mensaje se manda para que socket.io conecte el jugador a la room
  // antes cad jugador debe haber obtenido sus credenciales
  // en los endpoints http

  // TODO fijarse que pasa cuando se desconecta y se vuelve a desconectar un jugador
  // si
  @SubscribeMessage('room::game::join')
  joinGame(
    @MessageBody() joinGameRoomDto: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    const { roomId, playerId } = joinGameRoomDto;
    const gameState = this.tatetiService.getGameRoomById(
      joinGameRoomDto.roomId,
    );

    if (!gameState) {
      this.logger.warn('la room no existe');
      return;
    }

    this.logger.debug('id: ', socket.id);

    gameState.connect({ playerId, socketId: socket.id });
    // si el juego existe hace la conexion a la room
    this.logger.debug(`se une el socket ${socket.id} a la room ${roomId}`);

    socket.join(roomId);

    //mapea el playerId al roomId, para gestionar las desconexiones
    // this.players.set(playerId, roomId);
    this.playerRoom.push({ socketId: socket.id, roomId });
    // this.logger.debug('players: ', JSON.stringify(this.players.entries()));
    this.logger.debug(`playerRoom ${this.playerRoom}`);

    // y luego emite el estado
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
    const gameState = this.tatetiService.moveToGame(moveToGame);
    this.logger.debug(JSON.stringify(gameState));

    this.io.to(roomId).emit('room::game::state', instanceToPlain(gameState));
    return {
      message: 'played succesfully',
      ok: true,
    };
  }

  // @SubscribeMessage('disconnecting')
  // quitGame(
  //   @MessageBody() quitGame: QuitGameDto,
  //   @ConnectedSocket() socket: Socket,
  // ): any {
  //   console.log('se desconecto', quitGame);
  //   console.log(socket);
  //   // const gameState = this.tatetiService.quitGame(quitGame);
  //   // this.logger.debug(gameState);
  //   // socket
  //   //   .to(gameState.roomId)
  //   //   .emit('room::game::state', instanceToPlain(gameState));

  //   return { message: 'game quitted succesfully', ok: true };
  // }
}
