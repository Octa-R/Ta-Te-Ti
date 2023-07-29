import { PlayerState } from "../ui/PlayerState"
import { currentOpponentGameState, currentPlayerGameState, currentGameStatus, currentRoomIdState, currentTurn } from "../atoms";
import { useRecoilValue } from "recoil";
import { RoomIdState } from "./RoomIdState";
import { XMark } from "../ui/Xmark";
import { OMark } from "../ui/OMark";

type GameStateProps = {};

const GameState: React.FC<GameStateProps> = ({ }) => {
  const roomId = useRecoilValue(currentRoomIdState)
  const player = useRecoilValue(currentPlayerGameState)
  const opponent = useRecoilValue(currentOpponentGameState)
  const status = useRecoilValue(currentGameStatus)
  const turn = useRecoilValue(currentTurn)


  return (
    <div className="container text-l w-64 border-solid text-indigo-700 rounded-sm p-1 border-slate-300 max-w-md bg-slate-500 grid grid-rows-3 gap-1">
      <RoomIdState roomId={roomId} />
      <PlayerState name={player?.name || ""} score={player?.score || 0} isConnected={player?.isConnected || false} />
      <PlayerState name={opponent?.name || ""} score={opponent?.score || 0} isConnected={opponent?.isConnected || false} />
      <article className="bg-slate-200 rounded-sm font-bold flex py-1 justify-center items-center px-4 gap-4">
        {
          status === "PLAYING" ? (
            <>
              <label>Turn: </label>
              {turn === "X" ? <XMark size="sm" /> : <OMark size="sm" />}
            </>
          )
            :
            status
        }
      </article>
    </div >
  );
};

export { GameState };
