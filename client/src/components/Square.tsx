
import { OMark } from "../ui/OMark";
import { XMark } from "../ui/Xmark"
type SquareProps = {
	value: SquareValue;
	onSquareClick: (squareClick: SquareClick) => void;
	position: { row: number; col: number };
};

const Square: React.FC<SquareProps> = ({ value, onSquareClick, position }) => {
	const activeSquare =
		value === " "
			? "transition duration-500 ease-in-out  hover:bg-blue-300"

			: "pointer-events-none ";
	return (

		<button
			className={
				"aspect-square rounded-sm h-28 border-solid bg-slate-300 " +
				activeSquare
			}
			onClick={() => onSquareClick({ value, position })}
		>
			{
				value === "X" && <XMark /> || value === "O" && <OMark /> || " "
			}
		</button>
	);
};

export { Square };
