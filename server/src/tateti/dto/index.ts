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

export interface PlayerStateDto {
  name: string;
  mark: MARK;
  score: number;
  isConnected: boolean;
}
