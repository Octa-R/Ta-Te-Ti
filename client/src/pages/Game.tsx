import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../components/InnerContainer";
import { useGameRoom } from "../hooks";
/*
TODO cuando se recarga la pagina, se pierden los datos de la room
fijarse que se guarden en localstorage
*/
export function Game() {
  useGameRoom()

  return (
    <InnerContainer>
      <GameState />
      <Board />
    </InnerContainer>
  );
}
