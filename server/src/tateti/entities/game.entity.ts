import {
  BaseEntity,
  Cascade,
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
  turnCount = 0;

  @Property({ hidden: true })
  player1WantsToPlayAgain: boolean;
  @Property({ hidden: true })
  player2WantsToPlayAgain: boolean;
  @OneToOne({ cascade: [Cascade.REMOVE] })
  player1: Player;
  @OneToOne({ nullable: true, cascade: [Cascade.REMOVE] })
  player2?: Player;
  @Property()
  status: GAME_STATUS = 'WAITING_OPPONENT';
  @Property()
  turn: MARK = 'X';
  @Property({ type: 'json' })
  board: VALUE[][];
  @Property()
  matchResult: MATCH_RESULT;

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

  setPlayer2(player: Player): Player {
    if (this.isFull()) {
      throw new Error('la room esta llena');
    }
    this.player2 = player;

    if (this.player1.mark === 'X') {
      this.player2.mark = 'O';
    } else {
      this.player2.mark = 'X';
    }
    this.status = 'PLAYING';
    return this.player2;
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

  getPlayerById(playerId: string): Player {
    if (playerId === this.player1?.id) {
      return this.player1;
    }
    if (playerId === this.player2?.id) {
      return this.player2;
    }
    return null;
  }

  setPlayerWantsToPlayAgain({ playerId }) {
    if (this.player1.id === playerId) {
      this.player1WantsToPlayAgain = true;
    } else if (this.player2.id === playerId) {
      this.player2WantsToPlayAgain = true;
    } else {
      throw new Error('player not found');
    }

    if (this.player1WantsToPlayAgain && this.player2WantsToPlayAgain) {
      this.resetGame();
      return true;
    } else {
      return false;
    }
  }

  playerMakeMove({ row, col, mark, playerId }) {
    if (this.status === 'WAITING_OPPONENT') {
      throw new Error(
        'la partida no puede empezar hasta que se conecte el otro jugador',
      );
    }

    if (this.status === 'GAME_OVER') {
      throw new Error('la partida termino');
    }

    if (this.board[row][col] !== ' ') {
      throw new Error('el cuadrado esta ocupado');
    }

    const player = this.getPlayerById(playerId);

    if (!player) {
      throw new Error('el jugador no pertenece a la partida');
    }

    // si el turno la marca y la marca del player son iguales
    if (
      this.turn !== player.mark ||
      this.turn !== mark ||
      player.mark !== mark
    ) {
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
          this.matchResult = 'TIE';
        }
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
    const player = this.getPlayerById(playerId);
    if (player) {
      player.connect();
      return true;
    }
    return false;
  }

  playerDisconnect(playerId) {
    const player = this.getPlayerById(playerId);
    if (player) {
      player.disconnect();
      return true;
    }
    return false;
  }

  isFull() {
    return this.player1 && this.player2;
  }

  isEmpty() {
    return (
      !this.player1.isConnected && (!this.player2 || !this.player2.isConnected)
    );
  }
}
