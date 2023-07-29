import { ReactComponent as CopyIcon } from "../icons/copy-icon.svg"
import { ReactComponent as CheckIcon } from "../icons/check-icon.svg"
import { useCopyToClipboard } from 'usehooks-ts'
import React, { useState } from "react"

type Props = {
    roomId: string
}

export const RoomIdState: React.FC<Props> = ({ roomId }) => {
    const [value, copy] = useCopyToClipboard()
    const [hasCopiedText, setHasCopiedText] = useState(false)

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