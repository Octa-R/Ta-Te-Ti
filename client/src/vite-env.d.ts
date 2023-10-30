/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
type SquareValue = "X" | "O" | " ";

type SquareClick = {
  value: SquareValue;
  position: { row: number; col: number };
};

type GAME_STATUS = "WAITING_OPPONENT" | "PLAYER_PLAYING" | "OPPONENT_PLAYIG";

type MARK = "X" | "O";

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_REDIS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
