import { Injectable, Logger } from '@nestjs/common';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { Game } from './models/game.model';
import * as randomString from 'randomstring';
import { randomUUID } from 'crypto';
import { MoveToGameDto } from './dto/move-to-game.dto';

@Injectable()
export class TatetiService {
  gameRooms: Game[];
  private readonly logger = new Logger(TatetiService.name);
  constructor() {
    this.gameRooms = [];
  }
  createGameRoom({ name, mark }): NewPlayerDataDto {
    const playerId = randomUUID();
    const roomId = this.generateRoomId();
    const newGame: Game = new Game({ roomId });

    const player1 = newGame.setPlayer1({
      id: playerId,
      name,
      mark,
      score: 0,
      isConnected: false,
    });

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

  joinGameRoom({ roomId, name }): NewPlayerDataDto {
    const game: Game = this.gameRooms.find(
      (game) => game.getRoomId() === roomId,
    );

    if (!game) {
      this.logger.error(`rom with id: ${roomId} not found`);
      throw new Error(`rom with id: ${roomId} not found`);
    }

    if (game.isFull()) {
      this.logger.error(`rom with id: ${roomId} is full`);
      throw new Error(`rom with id: ${roomId} is full`);
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

  moveToGame(moveToGame: MoveToGameDto) {
    const game = this.getGameRoomById(moveToGame.roomId);
    if (!game) {
      this.logger.error(`rom with id: ${moveToGame.roomId} not found`);

      return Error('not found');
    }
    game.move({ ...moveToGame });
    return game;
  }

  quitGame(data): Game {
    const game = this.gameRooms.find(
      (game) => game.getRoomId() === data.roomId,
    );

    game.quit({ ...data });

    return game;
  }

  getGameRoomById(roomId: string): Game {
    return this.gameRooms.find((game) => game.getRoomId() === roomId);
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
}
