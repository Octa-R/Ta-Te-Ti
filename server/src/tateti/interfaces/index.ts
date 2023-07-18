import { Server, Socket } from 'socket.io';

export interface PlayerGameState {
  name: string;
  score: number;
  isConnected: boolean;
  mark: 'X' | 'O';
}

export interface CurrentGameState {
  roomId: string;
  board: VALUE[][];
  player1: PlayerGameState;
  player2: PlayerGameState;
  status: GAME_STATUS;
  turn: MARK;
  matchResult: MATCH_RESULT;
}

export interface ClientToServerEvents {
  ['room::create']: (name: string, callback: (roomId: number) => void) => void;
  ['room::game::init']: () => void;
  ['room::game::join']: () => void;
  ['room::game::move']: () => void;
  ['room::game::quit']: () => void;
}

export interface ServerToClientEvents {
  ['room::game::state']: (state: any) => void;
  ['room::game::over']: () => void;
  ['room::closed']: () => void;
  ['room::opened']: (roomId: string) => void;
  ['exception']: (data: any) => void;
  ['room::game::player::data']: (data: any) => void;
}

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type GameServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  any
>;
