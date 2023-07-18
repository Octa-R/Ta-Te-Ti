import { SquareClick } from "../types/SquareClick";
import { SquareValue } from "../types/SquareValue";

type SquareProps = {
	value: SquareValue;
	onSquareClick: (squareClick: SquareClick) => void;
	position: { row: number; col: number };
};

const Square: React.FC<SquareProps> = ({ value, onSquareClick, position }) => {
	const activeSquare =
		value === " "
			? "transition ease-in-out delay-75 hover:bg-blue-200"
			: "pointer-events-none";
	return (
		<button
			className={
				"aspect-square rounded-sm h-28 border-solid bg-slate-300 " +
				activeSquare
			}
			onClick={() => onSquareClick({ value, position })}
		>
			{value !== " " ? (
				value === "O" ? (
					<svg
						className=" w-16 h-16 text-red-500 m-auto"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<circle
							className="fill-none stroke-current"
							cx="12"
							cy="12"
							r="10"
						/>
					</svg>
				) : (
					<svg
						className="w-20 h-20 text-blue-500 m-auto"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							className="fill-current"
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
						/>
					</svg>
				)
			) : (
				""
			)}
		</button>
	);
};

export { Square };
