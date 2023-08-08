import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../components/ui/InnerContainer";
import { useGameRoom } from "../hooks";
import { CloseButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
/*
TODO cuando se recarga la pagina, se pierden los datos de la room
fijarse que se guarden en localstorage
*/
export function Game() {
  useGameRoom()
  const navigate = useNavigate()

  return (
    <InnerContainer>
      <GameState />
      <Board />
      <CloseButton
        title="Close popover"
        size="xl"
        iconSize={20}
        radius="xl"
        variant="filled"
        className="bg-slate-500"
        c="black"
        onClick={() => {
          navigate("/")
        }
        } />
    </InnerContainer>
  );
}
