import { PlayerGameState } from "./player-state";

export interface CurrentGameState {
  board: SquareValue[][];
  player1: PlayerGameState;
  player2: PlayerGameState;
  status: GAME_STATUS;
  roomId: string;
}
