import { Board } from "../components/Board";
import { GameState } from "../components/GameState";
import { InnerContainer } from "../components/InnerContainer";
import { useGameRoom } from "../hooks";

export function Game() {
  useGameRoom()

  return (
    <InnerContainer>
      <GameState />
      <Board />
    </InnerContainer>
  );
}
