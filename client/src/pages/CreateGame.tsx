import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { TextField } from "../ui/TextField";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isPlayerHostState, nameState } from "../atoms";
import { InnerContainer } from "../components/InnerContainer";
import { useEffect } from "react";

export function CreateGame() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useRecoilState<string>(nameState)
    const setIsHost = useSetRecoilState(isPlayerHostState)

    useEffect(() => {
        setIsHost(true)
    }, [])

    return (
        <InnerContainer>
            <TextField label={"name"} value={playerName} onChange={(value) => {
                setPlayerName(value)
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