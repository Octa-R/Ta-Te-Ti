import { Inject, Injectable, Logger } from '@nestjs/common';
import { NewPlayerDataDto } from './dto/new-player-data.dto';
import { Game } from './entities/game.entity';
import { Player } from './entities/player.entity';
import Redis from 'ioredis';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConnectionsService } from './services/connections.service';

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
    private conn: ConnectionsService,
  ) {}

  //este metodo crea la room, y devuelve las credenciales al host
  async createGameRoom({ name, mark }): Promise<NewPlayerDataDto> {
    const newGame = new Game({});
    const roomId = await this.conn.createRoom(newGame.id);
    const player1 = new Player({ name, mark });
    newGame.setPlayer1(player1);
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
  /*
esta funcion la usa el player 2 para unirse a la room creada, y obtener sus credenciales
*/
  async joinGameRoom({ gameId, name, roomId }): Promise<NewPlayerDataDto> {
    const game = await this.gameRepo.findOneOrFail(
      { id: gameId },
      { populate: ['player1', 'player2'] },
    );

    if (!game) {
      throw new Error(`room with id: ${gameId} not found`);
    }

    if (game.isFull()) {
      throw new Error(`room with id: ${gameId} is full`);
    }

    const player2 = new Player({ name });
    game.setPlayer2(player2);
    await this.em.persist(game).flush();
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

  /*
  esta funcion se utiliza para cuando los jugadores quieren comenzar el juego
  primero el jugador 1 tiene que crear el juego y e jugador debe haberse unido
  utilizando la funcion joinGameRoom
  */
  async playerEnterGameRoom({ gameId, playerId }) {
    const game = await this.gameRepo.findOneOrFail(
      { id: gameId },
      { populate: ['player1', 'player2'], refresh: true },
    );

    if (game.player1.id === playerId) {
      game.player1.isConnected = true;
    } else {
      game.player2.isConnected = true;
    }
    await this.em.persistAndFlush(game);
    return game;
  }

  async moveToGame({ gameId, playerId, row, col, mark }) {
    const game = await this.gameRepo.findOneOrFail(
      { id: gameId },
      { populate: ['player1', 'player2'] },
    );
    game.playerMakeMove({ playerId, row, col, mark });
    this.em.flush();
    return game;
  }

  async playerDisconnect({ gameId, playerId }): Promise<Game> {
    this.logger.debug(`gameid: ${gameId}, playerid: ${playerId}`);
    const game = await this.gameRepo.findOneOrFail(
      { id: gameId },
      { populate: ['player1', 'player2'] },
    );
    game.playerDisconnect(playerId);
    this.logger.debug(JSON.stringify(game));
    this.em.flush();
    return game;
  }

  async playAgain({ gameId, playerId }) {
    const game = await this.gameRepo.findOneOrFail(
      { id: gameId },
      { populate: ['player1', 'player2'] },
    );
    game.setPlayerWantsToPlayAgain({ playerId });
    this.em.flush();
    return game;
  }
}
