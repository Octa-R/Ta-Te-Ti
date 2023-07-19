import { PlayerState } from "../ui/PlayerState"
import { currentOpponentData, currentPlayerData, currentGameStatus } from "../atoms";
import { useRecoilValue } from "recoil";
type GameStateProps = {};

const GameState: React.FC<GameStateProps> = ({ }) => {
  const player = useRecoilValue(currentPlayerData)
  const opponent = useRecoilValue(currentOpponentData)
  const status = useRecoilValue(currentGameStatus)

  return (
    <div className="container text-xl w-96 border-solid text-indigo-700 rounded-sm p-1 shadow-xl shadow-indigo-500/50 border-neutral-400 max-w-md bg-slate-200 grid grid-rows-3 gap-1">
      <PlayerState name={player?.name || ""} score={player?.score || 0} isConnected={player?.isConnected || false} />
      <PlayerState name={opponent?.name || ""} score={opponent?.score || 0} isConnected={opponent?.isConnected || false} />
      {status}

    </div>
  );
};

export { GameState };
