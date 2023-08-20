import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { GameSocket } from '../interfaces';
import * as randomString from 'randomstring';

@Injectable()
export class ConnectionsService {
  connectedSockets = 'connected_sockets';
  connectedPlayers = 'connected_players';
  roomConnections = 'room_connections';
  gameRooms = 'game_rooms';
  private readonly logger = new Logger(ConnectionsService.name);

  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  removeConnectionToRoom(socket) {}

  async addConnectionToRoom(socket: GameSocket, roomId) {
    this.redis.hset(this.connectedSockets, socket.id, roomId);
    await socket.join(roomId);
    this.redis.hset(`${this.roomConnections}:${roomId}`, socket.id, 1);
    const roomSocket = await this.redis.hgetall(
      `${this.roomConnections}:${roomId}`,
    );

    this.logger.debug(
      `se une el socket ${
        socket.id
      } a la room ${roomId}, estan estos sockets conectados ${JSON.stringify(
        roomSocket,
      )}`,
    );
    return true;
  }

  async disconnetSocketFromRoom(socket: GameSocket, roomId) {
    //seteo como 0 el valor del socket en la room
    await this.redis.hset(`${this.roomConnections}:${roomId}`, socket.id, 0);
    const room = await this.redis.hgetall(`${this.roomConnections}:${roomId}`);

    this.logger.debug(` estado de la room: ${JSON.stringify(room)}`);

    if (Object.values(room).every((socketId) => socketId === '0')) {
      this.logger.debug(
        'ambos jugadores estan desconectados, se procedera a borar la partida',
      );
    }
  }

  async getGameIdByRoom(roomId: string): Promise<string> {
    const gameId = await this.redis.hget(this.gameRooms, roomId);
    if (!gameId) {
      throw new Error('roomId not found');
    }
    return gameId;
  }

  getRoomIdBySocket(socketId: string): Promise<string> {
    return this.redis.hget(this.connectedSockets, socketId);
  }

  getPlayerIdBySocket(socketId: string): Promise<string> {
    return this.redis.hget(this.connectedPlayers, socketId);
  }

  //-------connections
  // asocia el shortId generado con el longId
  async createRoom(id: string): Promise<string> {
    const roomId = this.generateRoomId();
    await this.redis.hset(this.gameRooms, roomId, id);
    return roomId;
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
  //-------

  playerConnect() {}
  playerDisconnect() {}
}
