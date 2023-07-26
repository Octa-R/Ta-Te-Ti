import { PlayerGameState } from "./player-state";

export interface CurrentGameState {
  board: SquareValue[][];
  player1: PlayerGameState;
  player2: PlayerGameState;
  status: string;
  roomId: string;
  turn: string;
}
