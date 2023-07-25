import { Logger } from '@nestjs/common';
import { GameStateDto } from '../dto';
import { CurrentGameState } from '../interfaces';
import { Player } from './player.model';
import { Exclude, Type } from 'class-transformer';

export class Game {
  @Exclude()
  id: string;

  @Type(() => Player)
  private player1: Player;
  @Type(() => Player)
  private player2: Player;

  roomId: string;
  status: GAME_STATUS;
  turn: MARK;
  board: VALUE[][];

  @Exclude()
  private readonly logger = new Logger(Game.name);

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
    this.status = 'WAITING_OPPONENT';
    this.turn = 'X';
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ];
  }

  getRoomId() {
    return this.roomId;
  }

  setPlayer1(player: Partial<Player>): Player {
    this.player1 = new Player(player);
    return this.player1;
  }

  playerIsHost(playerId: string) {
    if (this.player1.id === playerId) {
      return true;
    }
    if (this.player2.id === playerId) {
      return false;
    }
  }

  setPlayer2(player: Partial<Player>): Player {
    if (this.isFull()) {
      throw new Error('la room esta llena');
    }
    this.player2 = new Player(player);
    if ((this.player1.mark = 'X')) {
      this.player2.mark = 'O';
    } else {
      this.player2.mark = 'X';
    }
    this.status = 'PLAYING';
    return this.player2;
  }

  getPlayerById(playerId: string) {
    if (playerId !== this.player1.id) {
      return this.player1;
    }
    if (playerId !== this.player2.id) {
      return this.player2;
    }
    return null;
  }

  move({ row, col, mark, playerId }) {
    if (this.status === 'WAITING_OPPONENT') {
      this.logger.log(
        'la partida no puede empezar hasta que se conecte el otro jugador',
      );

      return;
    }
    if (this.status === 'GAME_OVER') {
      console.log('la partida termino');
      return;
    }

    if (this.board[row][col] !== ' ') {
      this.logger.log('el cuadrado esta ocupado');
      return;
    }

    const player = this.getPlayerById(playerId);

    if (!player) {
      this.logger.log('el jugador no pertenece a la partida');
      return;
    }
    // si el turno la marca y la marca del player son iguales
    if (this.turn === player.mark && this.turn === mark) {
      this.board[row][col] = mark;
    }
    //siguiente turno
    if (this.turn === 'O') {
      this.turn = 'X';
    } else {
      this.turn = 'O';
    }
  }

  quit({ playerId, roomId }) {
    if (this.roomId !== roomId) {
      return;
    }

    if (playerId == this.player1.id) {
      this.player1.isConnected = false;
    }

    if (playerId == this.player2.id) {
      this.player2.isConnected = false;
    }
  }

  isFull() {
    return this.player1 && this.player2;
  }
}
