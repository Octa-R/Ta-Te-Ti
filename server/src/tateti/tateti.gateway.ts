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
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './exception.filter';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import { GameSocket } from './interfaces';
import { classToPlain, instanceToPlain } from 'class-transformer';

@UseFilters(new ValidationExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TatetiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  games: Game[];

  constructor() {
    this.games = [];
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }

  afterInit(server: Server) {
    console.log('server inicializado');
  }

  handleConnection(socket: GameSocket, ...args: any[]) {
    console.log('alguien se conectó', socket.id);
    // console.log(socket.eventNames());
  }

  handleDisconnect(socket: GameSocket) {
    console.log('alguien se desconecto', socket.id);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('room::create')
  createRoom(socket: GameSocket, data: CreateGameRoomDto): any {
    console.log({ data });
    const { name, mark } = data;
    const playerId = randomUUID();
    const newRoomId = this.generateRoomId();
    socket.join(newRoomId);
    console.log('este id:', socket.id, 'se conecto a la room:', newRoomId);
    const newGame: Game = new Game({ roomId: newRoomId });
    newGame.setPlayer1({
      id: playerId,
      name,
      mark,
      socketId: socket.id,
      score: 0,
      isConnected: false,
    });
    this.games.push(newGame);
    // console.log(instanceToPlain(newGame));
    socket.emit('room::game::state', instanceToPlain(newGame));
    return instanceToPlain(newGame);
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
      return {
        event: 'error',
        message: 'roomID invalid',
      };
    }
    // socket.join(roomId);

    console.log(socket.eventNames);

    console.log('este id', socket.id, 'se conecto a la room', roomId);

    const newPlayer = game.setPlayer2({
      id: playerId,
      name,
      socketId: socket.id,
    });

    console.log('rooms del que se acaba de unbir: ', socket.rooms);

    socket.to(roomId).emit('room::game::state', game);

    return {
      message: 'game-room joined succesfully',
      playerId: playerId,
      roomId: roomId,
      mark: newPlayer.mark,
    };
  }

  @SubscribeMessage('room::game::move')
  makeMove(
    @MessageBody() data: MoveToGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const game = this.games.find((game) => game.getRoomId() === data.roomId);
    if (!game) {
      return {
        event: 'error',
        message: 'roomID invalid',
      };
    }

    game.move({ ...data });
    socket.to(data.roomId).emit('room::game::state', game);
    return {
      message: 'played succesfully',
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
}
