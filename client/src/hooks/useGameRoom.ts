import { useEffect } from "react";
import { socket } from "../lib/socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentGameState,
  currentPlayerData,
  socketConnectionState,
} from "../atoms";
import { CurrentGameState } from "../interfaces/game-state";
import { notifications } from "@mantine/notifications";

export function useGameRoom() {
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const setGameState = useSetRecoilState(currentGameState);
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

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);

      const data = {
        name: name,
        playerId: playerId,
        mark: mark,
        roomId: roomId,
      };

      socket.on("disconnect", () => {
        socket.emit("room::game::quit", { roomId, playerId });
      });

      console.log("se va a unir a la gameroom", roomId);
      if (roomId) {
        socket.emit("room::game::join", data, (res: string) => {
          console.log({ respuestaEventoJoin: res });
        });
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onGameState = (state: CurrentGameState) => {
      setGameState(state);
    };

    const onException = (exception: string) => {
      notifications.show({ message: exception, color: "red" });
      console.warn(exception);
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room::game::state", onGameState);
    socket.on("exception", onException);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room::game::state", onGameState);
      socket.off("exception", onException);
    };
  }, [mark, name, playerId, roomId, setGameState, setIsConnected]);
}
