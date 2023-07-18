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
import { Server, Socket } from 'socket.io';
import * as randomString from 'randomstring';
import { Game } from './models/game.model';
import { JoinGameRoomDto } from './dto/join-game-room.dto';
import { CreateGameRoomDto } from './dto/create-game-room.dto';
import { randomUUID } from 'crypto';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './exception.filter';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import { GameSocket } from './interfaces';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { Namespace } from 'socket.io';

@UseFilters(new ValidationExceptionFilter())
@UsePipes(new ValidationPipe())
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
  games: Game[];

  private readonly logger = new Logger(TatetiGateway.name);

  constructor() {
    this.games = [];
  }

  afterInit(): void {
    this.logger.log('Websocket gateway Initialized');
  }

  handleConnection(socket: GameSocket) {
    // socket.emit() esto lo envia a todos menos la conexion
    // this.io.emit() esto lo envia a todos incluidos nosotros
    this.logger.log(`WS client with id: ${socket.id} connected!`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  handleDisconnect(socket: GameSocket) {
    this.logger.log(`Disconnected socket with id: ${socket.id}`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('room::create')
  createRoom(socket: GameSocket, data: CreateGameRoomDto): any {
    console.log({ data });
    const { name, mark } = data;
    const playerId = randomUUID();
    const newRoomId = this.generateRoomId();
    socket.join(newRoomId);
    this.logger.debug(
      `cliente with id: ${socket.id} and name: ${name} connected to room ${newRoomId}`,
    );
    const newGame: Game = new Game({ roomId: newRoomId });
    const player1 = newGame.setPlayer1({
      id: playerId,
      name,
      mark,
      socketId: socket.id,
      score: 0,
      isConnected: false,
    });

    this.games.push(newGame);

    socket.to(socket.id).emit('room::game::player::data', {
      playerId,
      mark: player1.mark,
      roomId: newRoomId,
    });

    socket.emit('room::game::state', instanceToPlain(newGame));

    return {
      message: `room with id: ${newRoomId} created`,
      data: {
        playerId,
        mark,
        roomId: newRoomId,
      },
    };
  }

  @SubscribeMessage('room::game::join')
  joinGame(
    @MessageBody() joinGameRoom: JoinGameRoomDto,
    @ConnectedSocket() socket: GameSocket,
  ): any {
    const { name, roomId } = joinGameRoom;
    const playerId = randomUUID();
    const game = this.games.find((game) => game.getRoomId() === roomId);

    if (!game) {
      this.logger.error(`rom with id: ${roomId} not found`);
      return;
    }
    socket.join(roomId);

    this.logger.debug(
      `cliente with id: ${socket.id} and name: ${name} connected to room ${roomId}`,
    );

    const player2 = game.setPlayer2({
      id: playerId,
      name,
      socketId: socket.id,
    });

    socket.to(socket.id).emit('room::game::player::data', {
      playerId,
      mark: player2.mark,
      roomId,
    });

    socket.emit('room::game::state', instanceToPlain(game));

    return {
      message: `game-room with id ${roomId} joined succesfully`,
    };
  }

  @SubscribeMessage('room::game::move')
  makeMove(
    @MessageBody() moveToGame: MoveToGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const { roomId } = moveToGame;
    const game = this.games.find((game) => game.getRoomId() === roomId);
    if (!game) {
      this.logger.error(`rom with id: ${roomId} not found`);
      return;
    }

    game.move({ ...moveToGame });
    socket.to(roomId).emit('room::game::state', game);
    return {
      message: 'played succesfully',
      ok: true,
    };
  }

  @SubscribeMessage('room::game::quit')
  quitGame(
    @MessageBody() data: QuitGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const game = this.games.find((game) => game.getRoomId() === data.roomId);

    game.quit({ ...data });

    socket.emit('room::game::state', game);

    return { message: 'game quitted succesfully' };
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
}
