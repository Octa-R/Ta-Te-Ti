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
    return playerData.roomId;
  },
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
// player data
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
// oponnent data
export const currentOpponentData = selector({
  key: "currentOpponentData",
  get: ({ get }) => {
    const state = get(gameState);
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
    return get(gameState).roomId;
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
