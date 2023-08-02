import { Logger } from '@nestjs/common';
import { GameStateDto } from '../dto';
import { CurrentGameState } from '../interfaces';
import { Player } from './player.model';
import { Exclude, Type } from 'class-transformer';

export class Game {
  @Exclude()
  id: string;

  @Exclude()
  turns: number;

  @Type(() => Player)
  private player1: Player;
  @Type(() => Player)
  private player2: Player;

  roomId: string;
  status: GAME_STATUS;
  turn: MARK;
  board: VALUE[][];

  matchResult: MATCH_RESULT;

  @Exclude()
  private readonly logger = new Logger(Game.name);

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
    this.status = 'WAITING_OPPONENT';
    this.turn = 'X';
    this.turns = 0;
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
    if (playerId === this.player1?.id) {
      this.logger.debug(`se devolvera player 1}`);
      return this.player1;
    }
    if (playerId === this.player2?.id) {
      return this.player2;
    }
    return null;
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

    this.turns++;
    this.logger.debug(`turns: ${this.turns}`);

    if (this.turns >= 5) {
      //chequear si hay o no un ganador
      const [isGameOver, winner] = this.checkWinner();

      if (isGameOver) {
        this.status = 'GAME_OVER';
        this.logger.log(`el juego termino winner: ${winner}`);
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
          this.logger.log('empate o TIE');
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

    if (this.turns === 9) {
      return [true, 'TIE'];
    } else {
      return [false, null];
    }
  }

  connect({ socketId, playerId }) {
    this.logger.debug(
      `llego el playerId: ${playerId} con el socketid: ${socketId}`,
    );
    if (this.player1 && playerId === this.player1?.id) {
      this.logger.debug(`se conecto player 1`);
      this.player1.socketId = socketId;
      return true;
    }
    if (this.player2 && playerId === this.player2?.id) {
      this.logger.debug(`se conecto player 2`);
      this.player2.socketId = socketId;
      return true;
    }
    this.logger.debug(`estado del game ${JSON.stringify(this)}`);
    return false;
  }

  quit(socketId) {
    // if (this.roomId !== roomId) {
    //   return;
    // }

    if (socketId == this.player1.socketId) {
      this.player1.isConnected = false;
    }

    if (socketId == this.player2.socketId) {
      this.player2.isConnected = false;
    }
  }

  isFull() {
    return this.player1 && this.player2;
  }
}
