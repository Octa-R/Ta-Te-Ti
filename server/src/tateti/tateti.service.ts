import { Inject, Injectable, Logger } from '@nestjs/common';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { Game } from './entities/game.entity';
import { Player } from './entities/player.entity';
import * as randomString from 'randomstring';
import { MoveToGameDto } from './dto/move-to-game.dto';
import { QuitGameDto } from './dto/quit-game.dto';
import Redis from 'ioredis';
import { ConnectToGameDto } from './dto/connectToGame.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class TatetiService {
  roomsConnections = 'rooms_connections';
  connectedSockets = 'connected_sockets';
  connectedPlayers = 'connected_players';
  gameRoomsKey = 'game_rooms';
  gameState = 'game_state';

  private readonly logger = new Logger(TatetiService.name);

  constructor(
    @Inject('REDIS') private redis: Redis,
    private readonly em: EntityManager,
    @InjectRepository(Game)
    private readonly gameRepo: EntityRepository<Game>,
  ) {}

  //-------connections
  // asocia el shortId generado con el longId
  async addActiveRoom(id: string): Promise<string> {
    const roomId = this.generateRoomId();
    await this.redis.hset(this.gameRoomsKey, roomId, id);
    return roomId;
  }

  async getGameIdByCode(roomId: string): Promise<string> {
    return await this.redis.hget(this.gameRoomsKey, roomId);
  }

  private generateRoomId(): string {
    return randomString.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }
  //-------
  //este metodo crea la room, y devuelve las credenciales al host
  async createGameRoom({ name, mark }): Promise<NewPlayerDataDto> {
    this.logger.debug('se entro a createGameRoom');
    const newGame = new Game({});
    const player1 = new Player({ name, mark });
    newGame.setPlayer1(player1);
    const roomId = await this.addActiveRoom(newGame.id);
    this.logger.log(`se creo un nuevo gameroom ${newGame.id}, ${roomId}`);
    this.em.persistAndFlush(newGame);
    return {
      message: `room with id: ${roomId} created`,
      ok: true,
      playerId: player1.id,
      roomId,
      name,
      mark,
      isHost: true,
    };
  }

  async joinGameRoom({ roomId, name }): Promise<NewPlayerDataDto> {
    this.logger.debug('se ejecuto el joinGameRoom');
    const id = await this.getGameIdByCode(roomId);
    const game = await this.gameRepo.findOne({ id });

    if (!game) {
      this.logger.error(`room with id: ${roomId} not found`);
      throw new Error(`room with id: ${roomId} not found`);
    }

    if (game.isFull()) {
      this.logger.error(`room with id: ${roomId} is full`);
      throw new Error(`room with id: ${roomId} is full`);
    }

    const player2 = new Player({});
    game.setPlayer2(player2);
    this.logger.log(`se unio el p2 al gameroom ${JSON.stringify(game)}`);
    return {
      message: `room with id: ${roomId} joined!`,
      ok: true,
      playerId: player2.id,
      roomId,
      name,
      mark: player2.mark,
      isHost: false,
    };
  }

  async playerEnterGameRoom(connectToGame: ConnectToGameDto) {
    const { roomId, playerId } = connectToGame;
    const id = await this.getGameIdByCode(roomId);
    const game = await this.gameRepo.findOne(
      { id },
      { populate: ['player1', 'player2'] },
    );
    this.logger.debug(JSON.stringify(game));
    this.logger.debug('dentro de playerEnterGameRoom');

    if (!game) {
      this.logger.warn('la room no existe');
      throw new Error('la room no existe');
    }
    // conecto al player con el juego
    // game.playerConnect({ playerId });
    return game;
  }

  async moveToGame(moveToGame: MoveToGameDto) {
    const { roomId } = moveToGame;
    const id = await this.getGameIdByCode(roomId);
    const game = null;

    if (!game) {
      this.logger.error(`rom with id: ${moveToGame.roomId} not found`);
      throw new Error('not found');
    }
    game.move({ ...moveToGame });
    return game;
  }

  async playerDisconnect(quitGame: QuitGameDto): Promise<Game> {
    const { roomId, playerId } = quitGame;
    const id = await this.getGameIdByCode(roomId);
    const game = null;
    if (!game) {
      throw Error;
    }
    game.quit(playerId);
    this.logger.debug(`se va a enviar esto ${JSON.stringify(game)}`);
    return game;
  }

  async playAgain(playAgain) {
    const { roomId } = playAgain;
    const id = await this.getGameIdByCode(roomId);
    const game = null;
    game.setPlayerWantsToPlayAgain(playAgain);
    return game;
  }
}
