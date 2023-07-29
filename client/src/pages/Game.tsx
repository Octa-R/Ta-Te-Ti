import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../ui/InnerContainer";
import { useGameRoom } from "../hooks";
import { CloseButton } from "../ui/CloseButton";
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
      <CloseButton onClick={function (): void {
        navigate("/")
      }} />
    </InnerContainer>
  );
}
