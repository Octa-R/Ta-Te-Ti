import { useState } from "react";
import { Square } from "./Square";

function Board() {
	const [squares, setSquare] = useState<SquareValue[][]>([
		[" ", " ", " "],
		["O", " ", " "],
		[" ", "O", " "],
	]);

	const handleSquareClick = ({ value, position }: SquareClick) => {
		console.log("value y pos", value, position);
		const { row, col } = position;
		const newSquares = squares.slice();
		newSquares[row][col] = Math.random() > 0.5 ? "O" : "X";
		setSquare(newSquares);
	};

	const classes = [
		"grid grid-cols-3 grid-rows-3 content-center place-content-center place-items-center ",
		"rounded-sm aspect-square shadow-xl",
		"border-0 w-96 bg-slate-500"
	]

	return (
		<div className={classes.join(" ")}>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[0][0]}
				position={{ row: 0, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[0][1]}
				position={{ row: 0, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[0][2]}
				position={{ row: 0, col: 2 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[1][0]}
				position={{ row: 1, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[1][1]}
				position={{ row: 1, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[1][2]}
				position={{ row: 1, col: 2 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[2][0]}
				position={{ row: 2, col: 0 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[2][1]}
				position={{ row: 2, col: 1 }}
			/>
			<Square
				onSquareClick={handleSquareClick}
				value={squares[2][2]}
				position={{ row: 2, col: 2 }}
			/>
		</div>
	);
}

export { Board };
