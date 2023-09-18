import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { ValidationExceptionFilter } from './exceptions/exception.filter';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { GameSocket } from './interfaces';
import { Namespace } from 'socket.io';
import { TatetiService } from './services/tateti.service';
import { Game } from './entities/game.entity';
import { ConnectToGameDto } from './dto/connectToGame.dto';
import { ConnectionsService } from './services/connections.service';
/*
este gateway devuelve el estado del juego ante cualquier cambio
para poder unirse a una gameroom
hay que tener las credenciales necesarias
usando el mensaje join el servidor nos va a unir a la game room
*/
@UseFilters(new ValidationExceptionFilter())
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

  constructor(
    private gameService: TatetiService,
    private conn: ConnectionsService,
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
    try {
      const disconnectionData = await this.conn.handleDisconnection(socket.id);
      const { gameId, playerId, roomId } = disconnectionData;
      const game = await this.gameService.playerDisconnect({
        gameId,
        playerId,
      });
      this.io.to(roomId).emit('room::game::state', game);
    } catch (error) {
      this.logger.error(error.message || 'unknown error');
    }
    this.logger.log(`Number of connected sockets ${this.io.sockets.size}`);
  }
  /*
    este mensaje se manda para que socket.io conecte el jugador a la room
    la game_room tiene que haberse creado previamente
    y el jugador 2 se tiene que haber unido
    usando los endpoints http
  */
  @SubscribeMessage('room::game::join')
  async connectToGame(
    @MessageBody() connectToGame: ConnectToGameDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const { roomId, playerId } = connectToGame;
    try {
      //buscamos el gameId a partir del roomId
      const gameId = await this.conn.getGameIdByRoom(roomId);
      // nos unimos al juego
      const game = await this.gameService.playerEnterGameRoom({
        playerId,
        gameId,
      });
      //unimos el socket a la room
      await socket.join(roomId);
      // nos conectamos con redis
      await this.conn.handleConnection(socket.id, roomId, playerId, gameId);
      //asociamos el socket con la room, cada room tiene dos sockets
      //asociamos el socket con el player
      this.io.to(roomId).emit('room::game::state', game);
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
  async makePlayerMove(@MessageBody() moveToGame: MoveToGameDto): Promise<any> {
    const { roomId } = moveToGame;
    try {
      const gameId = await this.conn.getGameIdByRoom(roomId);
      const game: Game = await this.gameService.moveToGame({
        ...moveToGame,
        gameId,
      });
      this.io.to(roomId).emit('room::game::state', game);
      return {
        message: 'played succesfully',
        ok: true,
      };
    } catch (error) {
      this.logger.error(error);
      this.logger.debug('estamos en el catch');
      this.io.to(roomId).emit('exception', error.message);
      return {
        message: error | error.message,
        ok: false,
      };
    }
  }

  @SubscribeMessage('room::game::play_again')
  async playAgain(@MessageBody() playAgain: any): Promise<any> {
    const { roomId, playerId } = playAgain;
    try {
      const gameId = await this.conn.getGameIdByRoom(roomId);
      const game: Game = await this.gameService.playAgain({
        playerId,
        gameId,
      });
      this.io.to(roomId).emit('room::game::state', game);
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
