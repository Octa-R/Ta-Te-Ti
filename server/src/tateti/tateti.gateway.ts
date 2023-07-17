import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as randomString from 'randomstring';
import { CurrentGameState } from './interfaces';
import { Game } from './models/game.model';
import { GameStateDto, createGameRoomDto } from './dto';
import { Player } from './models/player.model';
import { randomUUID } from 'crypto';

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
    console.log('esto se ejecuta cuando inicia', server.sockets);
  }

  handleConnection(socket: any, ...args: any[]) {
    console.log('alguien se conectó', socket.id);
    socket.emit();
  }

  handleDisconnect(client: any) {
    console.log('alguien se destó');
  }

  @SubscribeMessage('room::create')
  createRoom(
    @MessageBody() createGameRoom: createGameRoomDto,
    @ConnectedSocket() socket: Socket,
  ): string {
    const newRoomId = this.generateRoomId();
    socket.join(newRoomId);
    console.log('este id:', socket.id, 'se conecto a la room:', newRoomId);
    const newGame: Game = new Game({ roomId: newRoomId });
    const player1 = new Player({
      id: randomUUID(),
      name: createGameRoom.name,
      mark: createGameRoom.mark,
      socketId: socket.id,
    });
    newGame.setPlayer1(player1);
    this.games.push(newGame);
    return 'game-room created';
  }

  @SubscribeMessage('room::game::join')
  joinGame(
    @MessageBody() { name: string },
    @ConnectedSocket() socket: Socket,
  ): string {
    const player2 = new Player({
      id: randomUUID(),
      name,
      mark: 'O',
      socketId: socket.id,
    });
    const game = this.games.find((game) => game.getRoomId() === roomId);
    return 'game-room joined succesfully';
  }

  @SubscribeMessage('room::game::move')
  makeMove(client: any, payload: any): string {
    return 'move played succesfuly';
  }

  @SubscribeMessage('room::game::quit')
  quitGame(client: any, payload: any): string {
    return 'game quitted';
  }
}
