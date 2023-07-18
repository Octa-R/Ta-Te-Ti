import { PlayerState } from "../ui/PlayerState"
type GameStateProps = {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
};

const GameState: React.FC<GameStateProps> = ({ }) => {

  return (
    <div className="container text-xl w-96 border-solid text-indigo-700 rounded-sm p-1 shadow-xl shadow-indigo-500/50 border-neutral-400 max-w-md bg-slate-200 grid grid-rows-3 gap-1">
      <PlayerState name='maria' score={2} isConnected={true} />
      <PlayerState name='pepe' score={2} isConnected={true} />
      {/* <Status /> */}

    </div>
  );
};

export { GameState };
