import React from "react";
import { ConnectionState } from "./ConnectionState";

type PlayerStateProps = {
    name: string;
    isConnected: boolean;
    score: number;
}

export const PlayerState: React.FC<PlayerStateProps> = ({ name, isConnected, score }) => {
    return (
        <div className="bg-slate-300 rounded-sm font-bold flex justify-around items-center  content-center place-content-center place-items-center px-4 gap-4">
            <ConnectionState isConnected={isConnected} />
            <span className="uppercase">{name}</span>
            <span className="proportional-nums ml-auto">{score}</span>
        </div>
    );
};
