import { Inject, Injectable, Logger } from '@nestjs/common';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { Game } from './models/game.model';
import * as randomString from 'randomstring';
import { randomUUID } from 'crypto';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import Redis from 'ioredis';
import { ConnectToGameDto } from './dto/connectToGame.dto';

@Injectable()
export class TatetiService {
  gameRooms: Game[];
  activeGameRoomsKey = 'active_rooms';

  private readonly logger = new Logger(TatetiService.name);

  constructor(@Inject('REDIS') private redis: Redis) {
    this.gameRooms = [];
  }

  async createGameRoom({ name, mark }): Promise<NewPlayerDataDto> {
    const playerId = randomUUID();
    const longRoomId = randomUUID();
    const roomId = this.generateRoomId();
    const newGame: Game = new Game({ roomId, id: longRoomId });

    // asocia el shortId generado con el longId
    await this.redis.hset(this.activeGameRoomsKey, roomId, longRoomId);

    newGame.setPlayer1({
      id: playerId,
      name,
      mark,
      score: 0,
      isConnected: false,
    });

    //aca deberia guardar la partida
    this.gameRooms.push(newGame);

    return {
      message: `room with id: ${roomId} created`,
      ok: true,
      playerId,
      roomId,
      name,
      mark,
      isHost: true,
    };
  }

  async joinGameRoom({ roomId, name }): Promise<NewPlayerDataDto> {
    const longRoomId = await this.redis.hget('active_rooms', roomId);
    const game = this.getGameRoomById(longRoomId);

    if (!game) {
      this.logger.error(`room with id: ${roomId} not found`);
      throw new Error(`room with id: ${roomId} not found`);
    }

    if (game.isFull()) {
      this.logger.error(`room with id: ${roomId} is full`);
      throw new Error(`room with id: ${roomId} is full`);
    }

    const playerId = randomUUID();

    const player2 = game.setPlayer2({
      id: playerId,
      name,
    });

    return {
      message: `room with id: ${roomId} joined!`,
      ok: true,
      playerId,
      roomId,
      name,
      mark: player2.mark,
      isHost: false,
    };
  }

  async playerEnterGameRoom(connectToGame: ConnectToGameDto) {
    const { roomId, playerId } = connectToGame;
    //obitene long roomid
    const longRoomId = await this.redis.hget('active_rooms', roomId);
    //obtiene el juego
    const gameState: Game = this.getGameRoomById(longRoomId);

    if (!gameState) {
      this.logger.warn('la room no existe');
      throw new Error('la room no existe');
    }

    // conecto al player con el juego
    gameState.playerConnect({ playerId });
    return gameState;
  }

  async moveToGame(moveToGame: MoveToGameDto) {
    const { roomId } = moveToGame;
    const longRoomId = await this.redis.hget('active_rooms', roomId);
    const game = this.getGameRoomById(longRoomId);
    if (!game) {
      this.logger.error(`rom with id: ${moveToGame.roomId} not found`);
      throw new Error('not found');
    }
    game.move({ ...moveToGame });
    return game;
  }

  async playerDisconnect(quitGame: QuitGameDto): Promise<Game> {
    const { roomId, playerId } = quitGame;
    const longRoomId = await this.redis.hget('active_rooms', roomId);
    const game = this.getGameRoomById(longRoomId);
    if (!game) {
      throw Error;
    }
    game.quit(playerId);
    this.logger.debug(`se va a enviar esto ${JSON.stringify(game)}`);
    return game;
  }

  getGameRoomById(id: string): Game {
    return this.gameRooms.find((game) => game.id === id);
  }

  async playAgain(playAgain) {
    const { roomId } = playAgain;
    const longRoomId = await this.redis.hget('active_rooms', roomId);
    const game = this.getGameRoomById(longRoomId);
    game.setPlayerWantsToPlayAgain(playAgain);
    return game;
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
}
