import { useRecoilValue } from "recoil";
import { currentBoardState, currentPlayerData } from "../atoms";
import { socket } from "lib/socket.io-client";
import { XMark } from "components/ui/icons/Xmark";
import { OMark } from "components/ui/icons/OMark";

type SquareProps = {
	value: SquareValue;
	onSquareClick: (squareClick: SquareClick) => void;
	position: { row: number; col: number };
};

const Square: React.FC<SquareProps> = ({ value, onSquareClick, position }) => {
	const activeSquare =
		value === " "
			? "transition duration-500 ease-in-out hover:bg-blue-300"
			: " ";
	return (
		<button
			className={
				"aspect-square rounded-sm h-20 bg-slate-200 border-none flex justify-center items-center " +
				activeSquare
			}
			onClick={() => onSquareClick({ value, position })}
		>
			{(value === "X" && <XMark size="lg" />) ||
				(value === "O" && <OMark size="lg" />) ||
				" "}
		</button>
	);
};

export function Board() {
	const board = useRecoilValue(currentBoardState);
	const { roomId, playerId, mark } = useRecoilValue(currentPlayerData);

	const handleSquareClick = ({ value, position }: SquareClick) => {
		console.log("value y pos", value, position);
		const { row, col } = position;
		const moveToGame = {
			row,
			col,
			roomId,
			playerId,
			mark,
		};
		// console.log("se va a hacer la siguiente jugada: ", moveToGame)
		socket.emit("room::game::move", moveToGame, (res) => {
			console.log("respuesta servidor desppues del move: ", res);
		});
	};

	const classes = [
		"grid grid-cols-3 grid-rows-3 content-center place-content-center place-items-center ",
		"rounded-sm aspect-square shadow-xl",
		"border-0 w-72 bg-slate-500",
	];

	return (
		<div className={classes.join(" ")}>
			<Square
				onSquareClick={handleSquareClick}
				value={board[0][0]}
				position={{ row: 0, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[0][1]}
				position={{ row: 0, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[0][2]}
				position={{ row: 0, col: 2 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[1][0]}
				position={{ row: 1, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[1][1]}
				position={{ row: 1, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[1][2]}
				position={{ row: 1, col: 2 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[2][0]}
				position={{ row: 2, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[2][1]}
				position={{ row: 2, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={board[2][2]}
				position={{ row: 2, col: 2 }}
			/>
		</div>
	);
}
