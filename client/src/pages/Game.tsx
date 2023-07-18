import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../components/InnerContainer";
// import { ConnectionState} from "../ui/ConnectionState"
import { socket } from "../lib/socket.io-client";
import { useEffect } from "react"
import { socketConnectionState, nameState, currentPlayerData, gameState } from "../atoms"
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil"

export function Game() {

  const name = useRecoilValue(nameState)
  const setIsConnected = useSetRecoilState(socketConnectionState);
  const playerData = useRecoilValue(currentPlayerData)
  const setGameState = useSetRecoilState(gameState)
  // const setSocketConn = useSetRecoilState(currentSocketConnection)
  useEffect(() => {

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
      // setSocketConn(socket)

      socket.on("room::opened", (roomId) => {
        console.log("se creo la room", roomId)
      })

      socket.on("room::game::over", () => {
        console.log("termino el juego")
      })

      socket.on("room::game::state", (state) => {
        console.log("llego el state y se va a setear", state)
        setGameState(state)
      })

      socket.emit("room::create", { name, mark: "X" }, (data) => {
        console.log("se creo la room y nos responden esto:", data)
      })
    }

    const onDisconnect = () => {
      console.log("disconected")
      setIsConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <InnerContainer>

      <GameState
        player1Name={"juan"}
        player2Name={"pepe"}
        player1Score={0}
        player2Score={0}
      />
      <Board />
    </InnerContainer>
  );
}
