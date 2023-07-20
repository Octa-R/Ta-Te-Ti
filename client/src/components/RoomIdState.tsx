import { ReactComponent as CopyIcon } from "../icons/copy-icon.svg"
import { ReactComponent as CheckIcon } from "../icons/check-icon.svg"
import { useCopyToClipboard } from 'usehooks-ts'
import React from "react"

type Props = {
    roomId: string
}

export const RoomIdState: React.FC<Props> = ({ roomId }) => {
    const [value, copy] = useCopyToClipboard()
    const hasCopiedText = Boolean(value);

    return (
        <article className="bg-slate-200 rounded-sm font-bold flex py-1 justify-around items-center px-4 gap-4">
            <div className="h-2 w-2 "></div>
            <label>Room-ID:</label>
            <div className="flex rounded-md border-2 ml-auto ">

                <p className="bg-slate-100 text-black rounded px-1 align-middle border border-slate-600">{roomId}</p>
                <button
                    disabled={hasCopiedText}
                    className="link ml-2"
                    onClick={() => copy(roomId)}
                >
                    {hasCopiedText ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </article>
    )
}