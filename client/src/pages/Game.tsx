import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../components/InnerContainer";
// import { ConnectionState} from "../ui/ConnectionState"
import { socket } from "../lib/socket.io-client";
import { useEffect } from "react"
import { socketConnectionState } from "../atoms"
import { useSetRecoilState } from "recoil"

export function Game() {

  const setIsConnected = useSetRecoilState(socketConnectionState);

  useEffect(() => {

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log("conn")
      setIsConnected(true)
      socket.emit("room::create", { name: "pepe", mark: "X" }, (data) => {
        console.log("se creo la room y nos responden esto:", data)
      })
      console.log("se emitio el evt create")
    }

    const onDisconnect = () => {
      console.log("disconected")
      setIsConnected(false)
    }

    socket.on("connect", onConnect)

    socket.on("connect_error", (err) => {
      console.log("error", err)
    })

    socket.on("room::game::state", (state) => {
      console.log("llego el state del juego", state)
    })

    socket.on("room::opened", (roomId) => {
      console.log("se creo la room", roomId)
    })

    socket.on("room::game::over", () => {
      console.log("termino el juego")
    })

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
