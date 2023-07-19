import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TextField } from "../ui/TextField";
import { useRecoilState, useSetRecoilState } from "recoil";
import { nameState, currentRoomIdState, isPlayerHostState } from "../atoms";
import { InnerContainer } from "../components/InnerContainer";
import { useEffect } from "react";

export function JoinGame() {
    const [roomId, setRoomId] = useRecoilState<string>(currentRoomIdState)
    const [playerName, setPlayerName] = useRecoilState<string>(nameState)
    const navigate = useNavigate();
    const setIsHost = useSetRecoilState(isPlayerHostState)
    useEffect(() => {
        setIsHost(true)
    }, [])
    return (
        <InnerContainer>
            <TextField label={"name"} value={playerName} onChange={(value) => {
                setPlayerName(value)
            }} />
            <TextField label={"room-id"} value={roomId} onChange={(value) => {
                setRoomId(value)
            }} />
            <Button
                onClick={() => {
                    navigate("/game");
                }}
            >
                Crear partida
            </Button>
        </InnerContainer>
    )
}