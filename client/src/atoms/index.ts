import { atom, selector } from "recoil";
import { CurrentGameState } from "../interfaces/game-state";
import { PlayerData } from "../interfaces/player-data";

export const socketConnectionState = atom({
  key: "SocketConnection",
  default: false,
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
    player1: { name: "", score: 0, isConnected: false, mark: "X" },
    player2: { name: "", score: 0, isConnected: false, mark: "O" },
    status: "WAITING_OPPONENT",
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

export const currentRoomIdState = selector({
  key: "currentRoomIdState",
  get: ({ get }) => {
    const playerData = get(currentPlayerData);
    return playerData.roomId;
  },
});

export const currentPlayerIdState = selector({
  key: "currentPlayerIdState",
  get: ({ get }) => {
    const playerData = get(currentPlayerData);
    return playerData.playerId;
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
