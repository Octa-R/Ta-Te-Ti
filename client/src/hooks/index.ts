import { useEffect } from "react";
import { socket } from "../lib/socket.io-client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentPlayerIdState,
  currentRoomIdState,
  gameState,
  isPlayerHostState,
  nameState,
  socketConnectionState,
} from "../atoms";
import { CurrentGameState } from "../interfaces/game-state";

export function useGameRoom() {
  const isHost = useRecoilValue(isPlayerHostState);
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const setGameState = useSetRecoilState(gameState);
  const playerName = useRecoilValue(nameState);
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

    const evt = isHost ? "room::create" : "room::game::join";
    socket.emit(evt, { mark: "X", name: playerName, roomId }, (data: any) => {
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

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room::game::state", onGameState);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room::game::state", onGameState);
    };
  }, []);
}
