import { useLocalStorage } from "@mantine/hooks";
import { Board } from "components/Board";
import { GameState } from "components/GameState";
import { InnerContainer } from "components/ui/InnerContainer";
import { useGameRoom } from "hooks/useGameRoom";
import { CloseButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { PlayerData } from "interfaces/player-data";
import { useEffect } from "react";
import { currentPlayerData } from "atoms";
import { useRecoilState } from "recoil";
/*
TODO cuando se recarga la pagina, se pierden los datos de la room
fijarse que se guarden en localstorage
*/
export function Game() {
	const [playerData, setPlayerData] = useRecoilState(currentPlayerData);
	useGameRoom();
	const navigate = useNavigate();
	const [storageData, setStorageData, removeStorageData] =
		useLocalStorage<PlayerData>({
			key: "player-data",
			defaultValue: {
				name: "",
				playerId: "",
				roomId: "",
				mark: "",
				isHost: false,
			},
		});

	useEffect(() => {
		// si en la app hay datos, se guarda en el storage
		if (storageData.playerId === "") {
			setStorageData(playerData);
		}
		//si en la app no hay datos, se busca en el storage
		if (playerData.playerId === "") {
			if (storageData.playerId !== "") {
				setPlayerData(storageData);
			}
		}
		return () => {
			// removeStorageData()
		};
	}, [playerData, setPlayerData, setStorageData, storageData]);

	return (
		<InnerContainer>
			<GameState />
			<Board />
			<CloseButton
				title="Close popover"
				size="xl"
				iconSize={20}
				radius="xl"
				variant="filled"
				className="bg-slate-500"
				c="black"
				onClick={() => {
					removeStorageData();
					navigate("/");
				}}
			/>
		</InnerContainer>
	);
}
