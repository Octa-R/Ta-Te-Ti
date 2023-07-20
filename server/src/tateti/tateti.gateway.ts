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
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './exception.filter';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import { GameSocket } from './interfaces';
import { instanceToPlain } from 'class-transformer';
import { Namespace } from 'socket.io';
import { TatetiService } from './tateti.service';
import { JoinGameRoomDto } from './dto/join-game-room.dto';
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

  constructor(private tatetiService: TatetiService) {}

  afterInit(): void {
    this.logger.log('Websocket gateway Initialized');
  }

  handleConnection(socket: GameSocket) {
    this.logger.log(`WS client with id: ${socket.id} connected!`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  handleDisconnect(socket: GameSocket) {
    this.logger.log(`Disconnected socket with id: ${socket.id}`);
    this.logger.debug(`Number of connected sockets ${this.io.sockets.size}`);
  }

  @SubscribeMessage('room::game::join')
  joinGame(
    @MessageBody() joinGameRoomDto: any,
    @ConnectedSocket() socket: Socket,
  ): any {
    // const gameState = this.tatetiService.moveToGame(moveToGame);
    const gameState = this.tatetiService.getGameRoomById(
      joinGameRoomDto.roomId,
    );
    // si el juego existe hace la conexion a la room
    socket
      .to(gameState.roomId)
      .emit('room::game::state', instanceToPlain(gameState));
    return {
      message: 'played succesfully',
      ok: true,
    };
  }

  @SubscribeMessage('room::game::move')
  makeMove(
    @MessageBody() moveToGame: MoveToGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const gameState = this.tatetiService.moveToGame(moveToGame);
    socket
      .to(moveToGame.roomId)
      .emit('room::game::state', instanceToPlain(gameState));
    return {
      message: 'played succesfully',
      ok: true,
    };
  }

  @SubscribeMessage('room::game::quit')
  quitGame(
    @MessageBody() quitGame: QuitGameDto,
    @ConnectedSocket() socket: Socket,
  ): any {
    const gameState = this.tatetiService.quitGame(quitGame);

    socket
      .to(gameState.roomId)
      .emit('room::game::state', instanceToPlain(gameState));

    return { message: 'game quitted succesfully', ok: true };
  }
}
