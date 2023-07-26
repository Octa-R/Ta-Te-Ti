import { useEffect } from "react";
import { socket } from "../lib/socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentGameState,
  currentPlayerData,
  socketConnectionState,
} from "../atoms";
import { CurrentGameState } from "../interfaces/game-state";

export function useGameRoom() {
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const setGameState = useSetRecoilState(currentGameState);
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
    };
    console.log("se va a unir a la gameroom", roomId);
    console.log(socket.id);
    socket.on("disconnect", () => {
      console.group("se desconecto el socket");
      socket.emit("room::game::quit", { roomId, playerId });
    });
    socket.emit("room::game::join", data, (res: any) => {
      console.log({ respuestaEventoJoin: res });
    });
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const onGameState = (state: CurrentGameState) => {
    console.log("llego el estado del juego y se va a actualizar", state);
    setGameState(state);
  };

  const onException = (exception: any) => {
    console.warn(exception);
  };

  useEffect(() => {
    console.log("se va a subscribir el socket a los eventos");
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
