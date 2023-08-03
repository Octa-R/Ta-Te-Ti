import { atom, selector } from "recoil";
import { CurrentGameState } from "../interfaces/game-state";

export const socketConnectionState = atom({
  key: "SocketConnection",
  default: false,
});

interface PlayerData {
  mark: string;
  name: string;
  playerId: string;
  roomId: string;
  isHost: boolean;
}

export const currentPlayerIdState = selector({
  key: "currentPlayerIdState",
  get: ({ get }) => {
    const playerData = get(currentPlayerData);
    return playerData.playerId;
  },
});
//---- Game State principal
export const currentGameState = atom<CurrentGameState>({
  key: "currentGameState",
  default: {
    board: [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    player1: { name: "", score: 0, isConnected: false },
    player2: { name: "", score: 0, isConnected: false },
    status: "WAITING_OPPONENT",
    roomId: "NONE",
    turn: "X",
    matchResult: "",
  },
});
// player data data que se usa como credencial
export const currentPlayerData = atom<PlayerData>({
  key: "currentPlayerData",
  default: {
    mark: "",
    name: "",
    playerId: "",
    roomId: "",
    isHost: false,
  },
});
// player game state, datos que se usan como estado del jugador
export const currentPlayerGameState = selector({
  key: "currentPlayerGameState",
  get: ({ get }) => {
    const state = get(currentGameState);
    const { name } = get(currentPlayerData);
    if (state.player1.name === name) {
      return {
        ...state.player1,
      };
    }
    if (state.player2.name === name) {
      return {
        ...state.player2,
      };
    }
  },
});
// oponnent data
export const currentOpponentGameState = selector({
  key: "currentOpponentGameState",
  get: ({ get }) => {
    const state = get(currentGameState);
    const { name } = get(currentPlayerData);
    if (state.player1.name === name) {
      return {
        ...state.player2,
      };
    }
    if (state.player2.name === name) {
      return {
        ...state.player1,
      };
    }
  },
});

export const currentRoomIdState = selector({
  key: "currentRoomIdState",
  get: ({ get }) => {
    return get(currentGameState).roomId;
  },
});

export const currentGameStatus = selector({
  key: "currentGameStatus",
  get: ({ get }) => {
    const state = get(currentGameState);
    return state.status;
  },
});

export const currentBoardState = selector({
  key: "currentBoardState",
  get: ({ get }) => {
    const state = get(currentGameState);
    return state.board;
  },
});

export const currentTurn = selector({
  key: "currentTurn",
  get: ({ get }) => {
    const state = get(currentGameState);
    return state.turn;
  },
});

export const currentMatchResult = selector({
  key: "currentMatchResult",
  get: ({ get }) => {
    const state = get(currentGameState);
    return state.matchResult;
  },
});
