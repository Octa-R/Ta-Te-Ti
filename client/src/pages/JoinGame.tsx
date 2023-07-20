import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TextField } from "../ui/TextField";
import { InnerContainer } from "../components/InnerContainer";
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
            const res = await fetch("http://localhost:3000/tateti/create", {
                method: "POST",
                body: JSON.stringify({ mark: "X", name: playerName }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const json = await res.json()
            console.log(json)
            setCurrentPlayerData(json)
        }

        fetchData().then(() => {
            navigate("/game");
        }).catch(e => {
            console.log({ e })
        })

    }
    return (
        <InnerContainer>
            <TextField label={"name"} value={playerName} onChange={(value) => {
                setPlayerName(value)
            }} />
            <TextField label={"room-id"} value={roomId} onChange={(value) => {
                setRoomId(value)
            }} />
            <Button
                onClick={handleClick}
            >
                Crear partida
            </Button>
        </InnerContainer>
    )
}