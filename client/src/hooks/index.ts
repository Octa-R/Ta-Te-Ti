import { useEffect } from "react";
import { socket } from "../lib/socket.io-client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentPlayerData,
  currentRoomIdState,
  gameState,
  socketConnectionState,
} from "../atoms";
import { CurrentGameState } from "../interfaces/game-state";

export function useGameRoom() {
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const setGameState = useSetRecoilState(gameState);
  // const roomId = useRecoilValue(currentRoomIdState);
  const { name, playerId, roomId, mark } = useRecoilValue(currentPlayerData);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // luego de conectarse al socket
  // se une a la gameroom
  // enviandole roomId y playerId
  // si las credenciales son correctas
  // corresponden con una gameroom existente
  // entonces

  const onConnect = () => {
    setIsConnected(true);

    const data = {
      name: name,
      playerId: playerId,
      mark: mark,
      roomId: roomId,
      fafa: "lopa",
    };
    console.log("se va a emitir el evento:");
    socket.emit("room::game::join", data, (res: any) => {
      console.log({ res });
    });
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const onGameState = (state: CurrentGameState) => {
    setGameState(state);
  };

  const onException = (exception: any) => {
    console.warn(exception);
  };

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room::game::state", onGameState);
    socket.on("exception", onException);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room::game::state", onGameState);
    };
  }, []);
}
