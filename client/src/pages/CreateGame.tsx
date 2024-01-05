import { useNavigate } from "react-router-dom";
import { Button, Stack, TextInput } from "@mantine/core";
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "atoms";
import { useState } from "react";
import { SegmentedControl } from "@mantine/core";
import { useGameEndpoint } from "hooks/useGameEndpoint";

export function CreateGame() {
	const navigate = useNavigate();
	const [playerName, setPlayerName] = useState("anon");
	const [mark, setMark] = useState("X");
	const setCurrentPlayerData = useSetRecoilState(currentPlayerData);
	const { isLoading, fetchData } = useGameEndpoint();

	const handleClick = () => {
		fetchData({ playerName, action: "create", mark })
			.then((json) => {
				setCurrentPlayerData({
					name: json.name,
					mark: json.mark,
					isHost: json.isHost,
					playerId: json.playerId,
					roomId: json.roomId,
				});
				navigate("/game");
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<Stack
			className="h-full w-full bg-sky-700"
			spacing="xl"
			justify="center"
			align="center"
			p={16}
		>
			<TextInput
				labelProps={{ style: { color: "#FAFAFA" } }}
				required
				size="xl"
				placeholder="anon"
				label="Name"
				variant="filled"
				withAsterisk={false}
				value={playerName}
				w={{ base: 250, sm: 250, md: 350, lg: 400 }}
				onChange={(event) => {
					setPlayerName(event.currentTarget.value);
				}}
			/>
			<SegmentedControl
				radius="xl"
				color={`${mark === "X" ? "blue" : "red"}`}
				size="xl"
				data={["X", "O"]}
				transitionDuration={100}
				onChange={(m) => {
					setMark(m);
				}}
			/>
			{isLoading ? (
				<Button
					loading
					onClick={handleClick}
					size="xl"
					variant="filled"
					w={{ base: 250, sm: 250, md: 350, lg: 400 }}
				>
					Crear partida
				</Button>
			) : (
				<Button
					onClick={handleClick}
					size="xl"
					variant="filled"
					w={{ base: 250, sm: 250, md: 350, lg: 400 }}
				>
					Crear partida
				</Button>
			)}
		</Stack>
	);
}
