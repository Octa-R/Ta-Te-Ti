import {
	currentOpponentGameState,
	currentPlayerGameState,
	currentGameStatus,
	currentRoomIdState,
	currentTurn,
	currentPlayerData,
	currentMatchResult,
} from "atoms";
import { useRecoilValue } from "recoil";
import { XMark } from "components/ui/icons/Xmark";
import { OMark } from "components/ui/icons/OMark";
import React, { useEffect } from "react";
import { ConnectionState } from "components/ui/ConnectionState";
import { socket } from "lib/socket.io-client";
import { CopyButton, Tooltip, ActionIcon, Code } from "@mantine/core";
import { IconCheck } from "components/ui/icons/IconCheck";
import { IconCopy } from "components/ui/icons/IconCopy";

type PlayerStateProps = {
	name: string;
	isConnected: boolean;
	score: number;
	mark: MARK | "";
};

export const PlayerState: React.FC<PlayerStateProps> = ({
	name,
	isConnected,
	score,
	mark,
}) => {
	return (
		<div className="bg-slate-200 rounded-sm font-bold flex justify-around items-center px-4 gap-4">
			<ConnectionState isConnected={isConnected} />
			<span className="uppercase">{name}</span>
			<span>{mark}</span>
			<span className="proportional-nums ml-auto">{score}</span>
		</div>
	);
};

type RoomIdStateProps = {
	roomId: string;
};

export const RoomIdState: React.FC<RoomIdStateProps> = ({ roomId }) => {
	return (
		<article className="bg-slate-200 rounded-sm font-bold flex py-1 justify-start items-center px-4 gap-4">
			<div className="h-2 w-2 " />
			<div>Room-ID:</div>
			<div className="flex rounded-md border-2 grow-1 ml-auto">
				<div className="bg-slate-300 text-black rounded align-middle border border-slate-600 flex flex-row  justify-between grow-1">
					<Code fz={16} className="bg-slate-300">
						{roomId}
					</Code>
					<CopyButton value={roomId} timeout={2000}>
						{({ copied, copy }) => (
							<Tooltip
								label={copied ? "Copied" : "Copy"}
								withArrow
								position="right"
							>
								<ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
									{copied ? <IconCheck /> : <IconCopy />}
								</ActionIcon>
							</Tooltip>
						)}
					</CopyButton>
				</div>
			</div>
		</article>
	);
};

export const GameState: React.FC = () => {
	const roomId = useRecoilValue(currentRoomIdState);
	const player = useRecoilValue(currentPlayerGameState);
	const opponent = useRecoilValue(currentOpponentGameState);
	const status = useRecoilValue(currentGameStatus);
	const turn = useRecoilValue(currentTurn);
	const { playerId } = useRecoilValue(currentPlayerData);
	const matchResult = useRecoilValue(currentMatchResult);

	useEffect(() => {
		if (status === "GAME_OVER") {
			setTimeout(() => {
				socket.emit(
					"room::game::play_again",
					{ playerId, roomId },
					(response: unknown) => {
						console.log(response);
					}
				);
			}, 2500);
		}
	}, [playerId, roomId, status]);

	const renderSwitch = (param: string) => {
		switch (param) {
			case "WAITING_OPPONENT":
				return "Esperando oponente";
			case "PLAYING":
				return (
					<>
						<div>Turn: </div>
						{turn === "X" ? <XMark size="sm" /> : <OMark size="sm" />}
					</>
				);
			case "GAME_OVER":
				switch (matchResult) {
					case "TIE":
						return "Empate";
					case "X_WINS":
						return <> Winner: {<XMark size="sm" />}</>;
					case "O_WINS":
						return <> Winner: {<OMark size="sm" />}</>;
					default:
						return "Error";
				}
			default:
				return param;
		}
	};

	return (
		<div className="container text-m w-60 border-solid text-indigo-700 rounded-sm p-1 border-slate-300 max-w-md bg-slate-500 grid grid-rows-3 gap-1 shadow-xl">
			<RoomIdState roomId={roomId} />
			<PlayerState
				name={player?.name || ""}
				score={player?.score || 0}
				isConnected={player?.isConnected || false}
				mark={player?.mark || ""}
			/>
			<PlayerState
				name={opponent?.name || ""}
				score={opponent?.score || 0}
				isConnected={opponent?.isConnected || false}
				mark={opponent?.mark || ""}
			/>
			<article className="bg-slate-200 rounded-sm font-bold flex py-1 justify-center items-center px-4 gap-4">
				{renderSwitch(status)}
			</article>
		</div>
	);
};
