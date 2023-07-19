import { atom, selector } from "recoil";
import { CurrentGameState } from "../interfaces/game-state";

export const socketConnectionState = atom({
  key: "SocketConnection",
  default: false,
});

export const nameState = atom({
  key: "nameState",
  default: "anon",
});

export const currentPlayerIdState = atom({
  key: "currentPlayerIdState",
  default: "",
});

export const currentRoomIdState = atom({
  key: "currentRoomId",
  default: "ASDF",
});

export const isPlayerHostState = atom({
  key: "isPlayerHostState",
  default: false,
});
//---- Game State principal
export const gameState = atom<CurrentGameState>({
  key: "gameState",
  default: {
    board: [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    player1: { name: "", score: 0, isConnected: false },
    player2: { name: "", score: 0, isConnected: false },
    status: "WAITING_OPPONENT",
    roomId: "ASDF",
  },
});

export const currentPlayerNameState = selector({
  key: "currentPlayerNameState",
  get: ({ get }) => {
    const state = get(gameState);
    const isHost = get(isPlayerHostState);
    return isHost ? state.player1.name : state.player2.name;
  },
});

export const currentPlayerData = selector({
  key: "currentPlayerData",
  get: ({ get }) => {
    const state = get(gameState);
    const playerName = get(currentPlayerNameState);

    if (state.player1.name === playerName) {
      return {
        ...state.player1,
      };
    }
    if (state.player2.name === playerName) {
      return {
        ...state.player2,
      };
    }
  },
});

export const currentOpponentData = selector({
  key: "currentOpponentData",
  get: ({ get }) => {
    const state = get(gameState);
    const playerName = get(currentPlayerNameState);

    if (state.player1.name === playerName) {
      return {
        ...state.player2,
      };
    }
    if (state.player2.name === playerName) {
      return {
        ...state.player1,
      };
    }
  },
});

export const currentGameStatus = selector({
  key: "currentGameStatus",
  get: ({ get }) => {
    const state = get(gameState);
    return state.status;
  },
});

export const currentBoardState = selector({
  key: "currentBoardState",
  get: ({ get }) => {
    const state = get(gameState);
    return state.board;
  },
});
