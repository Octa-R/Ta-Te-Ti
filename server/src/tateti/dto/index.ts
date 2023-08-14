import { PlayerGameState } from '../interfaces';

export interface GameStateDto {
  roomId: string;
  board: VALUE[][];
  player1: PlayerGameState;
  player2: PlayerGameState;
  status: GAME_STATUS;
  turn: MARK;
  matchResult: MATCH_RESULT;
}
