import { PlayerState } from "../ui/PlayerState"
import { currentOpponentGameState, currentPlayerGameState, currentGameStatus, currentRoomIdState } from "../atoms";
import { useRecoilValue } from "recoil";
import { RoomIdState } from "./RoomIdState";

type GameStateProps = {};

const GameState: React.FC<GameStateProps> = ({ }) => {
  const roomId = useRecoilValue(currentRoomIdState)
  const player = useRecoilValue(currentPlayerGameState)
  const opponent = useRecoilValue(currentOpponentGameState)
  const status = useRecoilValue(currentGameStatus)


  return (
    <div className="container text-l w-96 border-solid text-indigo-700 rounded-sm p-1 border-slate-300 max-w-md bg-slate-500 grid grid-rows-3 gap-1">
      <RoomIdState roomId={roomId} />
      <PlayerState name={player?.name || ""} score={player?.score || 0} isConnected={player?.isConnected || false} />
      <PlayerState name={opponent?.name || ""} score={opponent?.score || 0} isConnected={opponent?.isConnected || false} />
      <article className="bg-slate-200 rounded-sm font-bold flex py-1  justify-around items-center px-4 gap-4">
        {status}
      </article>
    </div >
  );
};

export { GameState };
