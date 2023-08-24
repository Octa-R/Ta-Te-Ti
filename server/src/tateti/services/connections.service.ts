import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { GameSocket } from '../interfaces';
import * as randomString from 'randomstring';

@Injectable()
export class ConnectionsService {
  //hashes
  connectionPlayer = 'connection_player';
  connectionRoom = 'connection_room';
  playerConnection = 'player_connection';
  playerGame = 'player_game';
  roomGame = 'room_game';
  //set
  roomConnections = 'room_connections';

  private readonly logger = new Logger(ConnectionsService.name);

  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async getGameIdByRoom(roomId: string): Promise<string> {
    const gameId = await this.redis.hget(this.roomGame, roomId);
    if (!gameId) {
      throw new Error('gameId not found');
    }
    return gameId;
  }

  async getRoomIdBySocket(socketId: string): Promise<string> {
    return await this.redis.hget(this.connectionRoom, socketId);
  }

  async getPlayerIdBySocket(socketId: string): Promise<string> {
    return await this.redis.hget(this.connectionPlayer, socketId);
  }

  async getGameIdBySocketId(socketId: string) {
    const playerId = await this.redis.hget(this.connectionPlayer, socketId);
    return await this.redis.hget(this.playerGame, playerId);
  }

  async getRoomConnectionCount(roomId): Promise<number> {
    return await this.redis.scard(`${this.roomConnections}:${roomId}`);
  }

  async createRoom(gameId: string): Promise<string> {
    const roomId = this.generateRoomId();
    await this.redis.hset(this.roomGame, roomId, gameId);
    return roomId;
  }

  async handleDisconnection(socketId: string) {
    const roomId = await this.getRoomIdBySocket(socketId);
    const playerId = await this.getPlayerIdBySocket(socketId);
    const gameId = await this.getGameIdByRoom(roomId);
    const count = await this.redis.scard(`${this.roomConnections}:${roomId}`);
    const room = await this.redis.smembers(`${this.roomConnections}:${roomId}`);
    // BORRAR
    // room.del(socket)
    const del_socket = this.redis.srem(
      `${this.roomConnections}:${roomId}`,
      socketId,
    );
    // socket -> player
    const socket_player = this.redis.hdel(this.connectionPlayer, socketId);
    // socket -> room
    const socket_room = this.redis.hdel(this.connectionRoom, socketId);
    // player -> game
    const player_game = this.redis.hdel(this.playerGame, playerId);
    // player -> socket
    const player_socket = this.redis.hdel(this.playerConnection, playerId);

    await Promise.all([
      socket_room,
      socket_player,
      del_socket,
      player_game,
      player_socket,
    ]);

    this.logger.debug(` estado de la room redis: ${JSON.stringify(room)}`);

    if (count === 0) {
      this.logger.debug(
        'ambos jugadores estan desconectados, se procedera a borar la partida',
      );
    }
    return { roomId, gameId, playerId };
  }

  async handleConnection(
    socketId: string,
    roomId: string,
    playerId: string,
    gameId: string,
  ) {
    const count = await this.redis.scard(`${this.roomConnections}:${roomId}`);
    if (count >= 2 || count < 0) {
      throw new Error('room is full');
    }

    // AGREGAR
    // socket -> room
    const socket_room = this.redis.hset(this.connectionRoom, socketId, roomId);
    // socket -> player
    const socket_player = this.redis.hset(
      this.connectionPlayer,
      socketId,
      playerId,
    );
    // player -> game
    const player_game = this.redis.hset(this.playerGame, playerId, gameId);
    // player -> connection
    const player_socket = this.redis.hset(
      this.playerConnection,
      playerId,
      socketId,
    );
    // room.add(socket)
    const add_socket = this.redis.sadd(
      `${this.roomConnections}:${roomId}`,
      socketId,
    );

    await Promise.all([
      socket_room,
      socket_player,
      add_socket,
      player_game,
      player_socket,
    ]);

    const room = await this.redis.smembers(`${this.roomConnections}:${roomId}`);

    this.logger.debug(
      `socket:${socketId} -> roomId:${roomId}, ${JSON.stringify(room)}`,
    );
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
}
