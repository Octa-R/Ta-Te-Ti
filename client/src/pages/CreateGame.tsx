import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TextField } from "../ui/TextField";
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "../atoms";
import { useState } from "react";
import Selector from "../ui/Selector";

export function CreateGame() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState("anon")
    const setCurrentPlayerData = useSetRecoilState(currentPlayerData)

    const handleClick = () => {
        const fetchData = async () => {

            const res = await fetch("http://localhost:3000/tateti/create", {
                method: "POST",
                body: JSON.stringify({ mark: "X", name: playerName }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error de servidor desconocido");
            }
            const json = await res.json()
            console.log(json)
            setCurrentPlayerData(json)
        }

        fetchData()
            .then(() => {
                navigate("/game");
            })
            .catch(e => {
                console.warn(e.message);
            });

    }

    return (
        <div className="flex bg-sky-700 flex-col w-full h-full items-center justify-center gap-4 p-4">
            <TextField label={"name"} value={playerName} onChange={(value) => {
                setPlayerName(value)
            }} />
            <Selector />
            <Button onClick={handleClick}>
                Crear partida
            </Button>
        </div>
    )
}