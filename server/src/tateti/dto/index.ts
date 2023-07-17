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

export interface createGameRoomDto {
  name: string;
  mark: MARK;
}

export interface joinGameRoomDto {
  name: string;
  roomId: string;
}

export interface moveToGameDto {
  row: number;
  col: number;
  roomId: string;
  playerId: string;
}
