import { currentOpponentGameState, currentPlayerGameState, currentGameStatus, currentRoomIdState, currentTurn } from "../atoms";
import { useRecoilValue } from "recoil";
import { XMark } from "../ui/Xmark";
import { OMark } from "../ui/OMark";
import { ReactComponent as CopyIcon } from "../icons/copy-icon.svg"
import { ReactComponent as CheckIcon } from "../icons/check-icon.svg"
import { useCopyToClipboard } from 'usehooks-ts'
import React, { useState } from "react"
import { ConnectionState } from "../ui/ConnectionState";

type PlayerStateProps = {
  name: string;
  isConnected: boolean;
  score: number;
}

export const PlayerState: React.FC<PlayerStateProps> = ({ name, isConnected, score }) => {
  return (
    <div className="bg-slate-200 rounded-sm font-bold flex justify-around items-center px-4 gap-4">
      <ConnectionState isConnected={isConnected} />
      <span className="uppercase">{name}</span>
      <span className="proportional-nums ml-auto">{score}</span>
    </div>
  );
};

type Props = {
  roomId: string
}

export const RoomIdState: React.FC<Props> = ({ roomId }) => {
  const [value, copy] = useCopyToClipboard()
  const [hasCopiedText, setHasCopiedText] = useState(Boolean(value))

  return (
    <article className="bg-slate-200 rounded-sm font-bold flex py-1 justify-start items-center px-4 gap-4">
      <div className="h-2 w-2 "></div>
      <label>Room-ID:</label>
      <div className="flex rounded-md border-2 grow-1 ml-auto">

        <p className="bg-slate-100 text-black rounded pl-2 align-middle border border-slate-600 flex flex-row gap-1 justify-between grow-1">{roomId}

          <button
            disabled={hasCopiedText}
            className="link"
            onClick={() => {
              copy(roomId)
              setHasCopiedText(true)
              setTimeout(() => {
                setHasCopiedText(false)
              }, 3000)
            }}
          >
            <div className="bg-slate-500  rounded-e">

              {hasCopiedText ? <CheckIcon /> : <CopyIcon />}
            </div>
          </button>
        </p>
      </div>
    </article>
  )
}

const GameState: React.FC<any> = ({ }) => {
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
