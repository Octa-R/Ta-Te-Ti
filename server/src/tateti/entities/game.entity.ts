import { Logger } from '@nestjs/common';
import { Exclude, Type } from 'class-transformer';

import {
  BaseEntity,
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Player } from './player.entity';
@Entity()
export class Game extends BaseEntity<Game, 'id'> {
  @PrimaryKey({ type: 'uuid', hidden: true })
  id: string = randomUUID();
  @Property({ hidden: true })
  turnCount: number = 0;
  @Property({ hidden: true })
  player1WantsToPlayAgain: boolean;
  @Property({ hidden: true })
  player2WantsToPlayAgain: boolean;
  @OneToOne()
  player1: Player;
  @OneToOne({ nullable: true })
  player2?: Player;
  @Property()
  status: GAME_STATUS = 'WAITING_OPPONENT';
  @Property()
  turn: MARK = 'X';
  @Property({ type: 'json' })
  board: VALUE[][];
  @Property()
  matchResult: MATCH_RESULT;
  @Exclude()
  private readonly logger = new Logger(Game.name);

  constructor(partial: Partial<Game>) {
    super();
    this.player2WantsToPlayAgain = false;
    this.player1WantsToPlayAgain = false;
    this.matchResult = 'NOT_OVER';
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ];
    Object.assign(this, partial);
  }

  setPlayer1(player: Player): Player {
    this.player1 = player;
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

  setPlayer2(player: Player): Player {
    if (this.isFull()) {
      throw new Error('la room esta llena');
    }
    this.player2 = player;
    this.logger.debug(`mark del p1 ${this.player1.mark}`);

    if (this.player1.mark === 'X') {
      this.player2.mark = 'O';
    } else {
      this.player2.mark = 'X';
    }
    this.logger.debug(`mark del p2 ${this.player2.mark}`);
    this.status = 'PLAYING';
    return this.player2;
  }

  getPlayer1Id() {
    return this.player1.id;
  }

  getPlayer2Id() {
    return this.player2.id;
  }

  getPlayerById(playerId: string): Player {
    if (playerId === this.player1?.id) {
      return this.player1;
    }
    if (playerId === this.player2?.id) {
      return this.player2;
    }
    return null;
  }

  setPlayerWantsToPlayAgain(data) {
    const player = this.getPlayerById(data.playerId);
    if (!player) {
      throw new Error();
    }

    if (this.playerIsHost(player.id)) {
      this.player1WantsToPlayAgain = true;
    } else {
      this.player2WantsToPlayAgain = true;
    }

    if (this.player1WantsToPlayAgain && this.player2WantsToPlayAgain) {
      this.resetGame();
      return true;
    } else {
      return false;
    }
  }

  private resetGame(): void {
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' '],
    ];
    this.turn = 'X';
    this.turnCount = 0;
    this.status = 'PLAYING';
  }

  move({ row, col, mark, playerId }) {
    if (this.status === 'WAITING_OPPONENT') {
      this.logger.log(
        'la partida no puede empezar hasta que se conecte el otro jugador',
      );
      throw new Error(
        'la partida no puede empezar hasta que se conecte el otro jugador',
      );
    }

    if (this.status === 'GAME_OVER') {
      console.log('la partida termino');
      throw new Error('la partida termino');
    }

    if (this.board[row][col] !== ' ') {
      this.logger.log('el cuadrado esta ocupado');
      throw new Error('el cuadrado esta ocupado');
    }

    const player = this.getPlayerById(playerId);

    if (!player) {
      this.logger.log('el jugador no pertenece a la partida');
      throw new Error('el jugador no pertenece a la partida');
    }

    // si el turno la marca y la marca del player son iguales
    if (
      this.turn !== player.mark ||
      this.turn !== mark ||
      player.mark !== mark
    ) {
      this.logger.log('no es el turno del jugador');
      throw new Error('no es el turno del jugador');
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

    this.turnCount++;

    if (this.turnCount >= 5) {
      const [isGameOver, winner] = this.checkWinner();

      if (isGameOver) {
        this.status = 'GAME_OVER';

        if (winner) {
          this.logger.log(`el juego termino, winner: ${winner}`);
          if (winner === 'X') {
            this.matchResult = 'X_WINS';
          }
          if (winner === 'O') {
            this.matchResult = 'O_WINS';
          }
        }

        if (this.player1.mark === winner) {
          this.player1.incrementScore();
        } else if (this.player2.mark === winner) {
          this.player2.incrementScore();
        } else if (!winner) {
          this.logger.log('el juego termino, hay empate o TIE');
          this.matchResult = 'TIE';
        }
      } else {
        this.logger.log('el juego todavia no termino');
      }
    }
  }

  private checkWinner() {
    // Chequear filas
    for (const row of this.board) {
      if (row[0] === row[1] && row[1] === row[2] && row[0] !== ' ') {
        return [true, row[0]];
      }
    }
    // Chequear columnas
    for (let col = 0; col < 3; col++) {
      if (
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col] &&
        this.board[0][col] !== ' '
      ) {
        return [true, this.board[0][col]];
      }
    }
    // Chequear diagonales
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2] &&
      this.board[0][0] !== ' '
    ) {
      return [true, this.board[0][0]];
    }

    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2] !== ' '
    ) {
      return [true, this.board[0][2]];
    }

    if (this.turnCount === 9) {
      return [true, null];
    } else {
      return [false, null];
    }
  }

  playerConnect({ playerId }) {
    if (this.player1 && playerId === this.player1?.id) {
      this.logger.debug(`se conecto player 1`);
      this.player1.isConnected = true;
      return true;
    }
    if (this.player2 && playerId === this.player2?.id) {
      this.player2.isConnected = true;
      this.logger.debug(`se conecto player 2`);
      return true;
    }
    this.logger.debug(`estado del game ${JSON.stringify(this)}`);
    return false;
  }

  quit(playerId) {
    if (this.player1 && playerId === this.player1?.id) {
      this.player1.isConnected = false;
      this.logger.debug(`se desconecto player 1`);
      return true;
    }
    if (this.player2 && playerId === this.player2?.id) {
      this.player2.isConnected = false;
      this.logger.debug(`se desconecto player 2`);
      return true;
    }
    this.logger.debug(`estado del game ${JSON.stringify(this)}`);
    return false;
  }

  isFull() {
    return this.player1 && this.player2;
  }
}
