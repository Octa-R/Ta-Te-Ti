type GAME_STATUS = "WAITING_OPPONENT" | "PLAYER_PLAYING" | "OPPONENT_PLAYIG";
import { atom, selector } from "recoil";
// import { Square } from "../components/Square";
import { SquareValue } from "../types/SquareValue";

interface CurrentGameState {
  board: SquareValue[][];
  player1: PlayerGameState;
  player2: PlayerGameState;
  status: GAME_STATUS;
  roomCode: string;
}

export const name = atom({
  key: "name",
  default: "anon",
});

export const gameState = atom<CurrentGameState>({
  key: "gameState",
  default: {
    board: [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ],
    player1: { name: "pepe", score: 2, isConnected: false },
    player2: { name: "maria", score: 4, isConnected: false },
    status: "OPPONENT_PLAYIG",
    roomCode: "BHJK",
  },
});

export const currentGameRoom = selector({
  key: "CurrentGameRoom",
  get: ({ get }) => {
    get(gameState);
    //     //obtenemos el id de la room
    //     //aca obtenemos el estado de la board de esa room room
    //     //socket.on("move"...)
    //     //   const response = await myDBQuery({
    //     //     userID: get(currentUserIDState),
    //     //   });
    //       return response.board;
    //     },
  },
});

export const gameStatus = atom<GAME_STATUS>({
  key: "gameStatus",
  default: "WAITING_OPPONENT",
});

export const socketConnectionState = atom({
  key: "SocketConnection",
  default: false,
});

export const boardState = atom({
  key: "BoardState",
  default: [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ],
});

interface PlayerGameState {
  name: string;
  score: number;
  isConnected: boolean;
}

// export const currentSocketConnection = selector({
//     key:"currentSocketConnection",
//     get: ({get}) => {

//     }
// })

// TIENE LOS DATOS GENERALES DE TODO EL JUEGO ACTUAL
//BOARD, NOMBRES,PUNTAJE,
// const currentGameState = selector({})

// const gameState = selector({
//     key: 'CurrentBoardState',
//     get: ({get}) => {

//     //obtenemos el id de la room
//     //get(currentGameRoom)
//     //aca obtenemos el estado de la board de esa room room
//     //socket.on("move"...)
//     //   const response = await myDBQuery({
//     //     userID: get(currentUserIDState),
//     //   });
//       return response.board;
//     },
// });
