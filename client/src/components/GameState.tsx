import { PlayerState } from "../ui/PlayerState"
import { currentOpponentGameState, currentPlayerGameState, currentGameStatus, currentRoomIdState } from "../atoms";
import { useRecoilValue } from "recoil";
import { useCopyToClipboard } from 'usehooks-ts'
import { ReactComponent as CopyIcon } from "../icons/copy-icon.svg"
import { ReactComponent as CheckIcon } from "../icons/check-icon.svg"
type GameStateProps = {};

const GameState: React.FC<GameStateProps> = ({ }) => {
  const roomId = useRecoilValue(currentRoomIdState)
  const player = useRecoilValue(currentPlayerGameState)
  const opponent = useRecoilValue(currentOpponentGameState)
  const status = useRecoilValue(currentGameStatus)
  const [value, copy] = useCopyToClipboard()
  const hasCopiedText = Boolean(value);

  return (
    <div className="container text-l w-96 border-solid text-indigo-700 rounded-sm p-1 border-slate-300 max-w-md bg-slate-300 grid grid-rows-3 gap-1">
      <article className="bg-slate-200 rounded-sm font-bold flex px-2 py-1 items-center">
        <label>Room-ID:</label>
        <div className="flex rounded-md border-2 ml-auto ">

          <p className="bg-slate-100 text-black rounded px-1 align-middle">{roomId}</p>
          <button
            disabled={hasCopiedText}
            className="link"
            onClick={() => copy(roomId)}
          >
            {hasCopiedText ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </article>
      <PlayerState name={player?.name || ""} score={player?.score || 0} isConnected={player?.isConnected || false} />
      <PlayerState name={opponent?.name || ""} score={opponent?.score || 0} isConnected={opponent?.isConnected || false} />
      <article className="bg-slate-200 rounded-sm font-bold flex px-2 py-1 items-center">
        {status}

      </article>
    </div >
  );
};

export { GameState };
