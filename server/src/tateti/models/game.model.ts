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

  setPlayer2(player: Partial<Player>): Player {
    this.player2 = new Player(player);
    if ((this.player1.mark = 'X')) {
      this.player2.mark = 'O';
    } else {
      this.player2.mark = 'X';
    }
    return this.player2;
  }

  move({ row, col, mark, playerId, roomId }) {
    if (this.roomId !== roomId) {
      return;
    }

    if (playerId !== this.player1.id && playerId !== this.player2.id) {
      return;
    }

    if (this.turn !== mark) {
      return;
    }

    if (this.board[row][col] !== ' ') {
      return;
    }

    this.board[row][col] = mark;
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
}
