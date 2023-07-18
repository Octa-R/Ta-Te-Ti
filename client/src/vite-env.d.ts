/// <reference types="vite/client" />

type SquareValue = "X" | "O" | " ";

type SquareClick = {
  value: SquareValue;
  position: { row: number; col: number };
};

type GAME_STATUS = "WAITING_OPPONENT" | "PLAYER_PLAYING" | "OPPONENT_PLAYIG";
