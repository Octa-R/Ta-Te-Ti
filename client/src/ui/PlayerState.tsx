import React from "react";
import { ConnectionState } from "./ConnectionState";

type PlayerStateProps = {
    name: string;
    isConnected: boolean;
    score: number;
}

export const PlayerState: React.FC<PlayerStateProps> = ({ name, isConnected, score }) => {
    return (
        <div className="bg-slate-300 rounded-sm font-bold flex justify-around items-baseline  content-center place-content-center place-items-center px-4 gap-4">
            <ConnectionState isConnected={isConnected} />
            <span className="uppercase align-middle">{name}</span>
            <span className="proportional-nums align-middle ml-auto">{score}</span>
        </div>
    );
};
