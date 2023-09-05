import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
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
      throw new Error('Room ID not found');
    }
    return gameId;
  }

  getRoomIdBySocket(socketId: string): Promise<string> {
    return this.redis.hget(this.connectionRoom, socketId);
  }

  getPlayerIdBySocket(socketId: string): Promise<string> {
    return this.redis.hget(this.connectionPlayer, socketId);
  }

  async getGameIdBySocketId(socketId: string) {
    const playerId = await this.redis.hget(this.connectionPlayer, socketId);
    return await this.redis.hget(this.playerGame, playerId);
  }

  getRoomConnectionCount(roomId): Promise<number> {
    return this.redis.scard(`${this.roomConnections}:${roomId}`);
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }

  async createRoom(gameId: string): Promise<string> {
    const roomId = this.generateRoomId();
    await this.redis.hset(this.roomGame, roomId, gameId);
    return roomId;
  }

  async handleConnection(
    socketId: string,
    roomId: string,
    playerId: string,
    gameId: string,
  ) {
    const count = await this.getRoomConnectionCount(roomId);
    if (count >= 2 || count < 0) {
      throw new Error('room is full');
    }
    const promises = [];
    // AGREGAR
    // socket -> room
    promises.push(this.redis.hset(this.connectionRoom, socketId, roomId));
    // socket -> player
    promises.push(this.redis.hset(this.connectionPlayer, socketId, playerId));
    // player -> game
    promises.push(this.redis.hset(this.playerGame, playerId, gameId));
    // player -> connection
    promises.push(this.redis.hset(this.playerConnection, playerId, socketId));
    // room.add(socket)
    promises.push(
      this.redis.sadd(`${this.roomConnections}:${roomId}`, socketId),
    );
    // se ejecutan todas las promesas en paralelo
    await Promise.all([...promises]);
  }

  async handleDisconnection(socketId: string) {
    //buscamos room y player en paralelo
    const [roomId, playerId] = await Promise.all([
      this.getRoomIdBySocket(socketId),
      this.getPlayerIdBySocket(socketId),
    ]);
    //contamos jugadores y obtenemos gameid en paralero
    const [gameId, count] = await Promise.all([
      this.getGameIdByRoom(roomId),
      this.getRoomConnectionCount(roomId),
    ]);
    const promises = [];
    // BORRAR
    // room.del(socket) si se borra el ultimo miembro, borra el set
    promises.push(
      this.redis.srem(`${this.roomConnections}:${roomId}`, socketId),
    );
    // socket -> player
    promises.push(this.redis.hdel(this.connectionPlayer, socketId));
    // socket -> room
    promises.push(this.redis.hdel(this.connectionRoom, socketId));
    // player -> game
    promises.push(this.redis.hdel(this.playerGame, playerId));
    // player -> socket
    promises.push(this.redis.hdel(this.playerConnection, playerId));

    if (count === 0) {
      promises.push(this.redis.hdel(this.roomGame, roomId));
    }
    // se ejecutan todas las promesas en paralelo
    await Promise.all([...promises]);

    return { roomId, gameId, playerId };
  }
}
