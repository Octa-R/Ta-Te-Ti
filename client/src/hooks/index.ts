import { useEffect } from "react";
import { socket } from "../lib/socket.io-client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentPlayerIdState,
  currentRoomIdState,
  gameState,
  isPlayerHostState,
  currentPlayerNameState,
  socketConnectionState,
} from "../atoms";
import { CurrentGameState } from "../interfaces/game-state";

export function useGameRoom() {
  const isHost = useRecoilValue(isPlayerHostState);
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const setGameState = useSetRecoilState(gameState);
  const playerName = useRecoilValue(currentPlayerNameState);
  const setPlayerId = useSetRecoilState(currentPlayerIdState);
  const [roomId, setRoomId] = useRecoilState(currentRoomIdState);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const onConnect = () => {
    setIsConnected(true);

    const eventName = isHost ? "room::create" : "room::game::join";

    const data = {
      name: playerName,
      mark: "X",
      roomId: "roomId",
      fafa: "lopa",
    };
    console.log("se va a emitir el evento:", eventName);
    socket.emit(eventName, data, (data: any) => {
      setPlayerId(data.playerId);
      setRoomId(data.roomId);
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
