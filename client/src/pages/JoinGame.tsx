import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TextField } from "../ui/TextField";
import { useSetRecoilState } from "recoil";
import { currentPlayerData } from "../atoms";
import { useState } from "react";

export function JoinGame() {
    const navigate = useNavigate();
    const setCurrentPlayerData = useSetRecoilState(currentPlayerData)
    const [roomId, setRoomId] = useState("")
    const [playerName, setPlayerName] = useState("anon")

    const handleClick = () => {
        const fetchData = async () => {
            const data = { name: playerName, roomId }
            console.log("se va a acer fetch a /tateti/join con esta data:", data)
            const res = await fetch("http://localhost:3000/tateti/join", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error de servidor desconocido");
            }
            const json = await res.json()
            setCurrentPlayerData(json)
        }

        fetchData()
            .then(() => {
                navigate("/game");
            })
            .catch(e => {
                console.warn(e.message)
            })

    }
    return (
        <div className="flex bg-sky-700 flex-col w-full h-full items-center justify-center gap-4 p-4">
            <TextField label={"name"} value={playerName} onChange={(value) => {
                setPlayerName(value)
            }} />
            <TextField label={"room-id"} value={roomId} onChange={(value) => {
                setRoomId(value)
            }} />
            <Button
                onClick={handleClick}
            >
                Unirse a partida
            </Button>
        </div>
    )
}