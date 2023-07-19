/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
type SquareValue = "X" | "O" | " ";

type SquareClick = {
  value: SquareValue;
  position: { row: number; col: number };
};

type GAME_STATUS = "WAITING_OPPONENT" | "PLAYER_PLAYING" | "OPPONENT_PLAYIG";

type MARK = "X" | "O";
