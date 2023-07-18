import { InnerContainer } from "../components/InnerContainer";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { TextField } from "../ui/TextField";
import { useRecoilState, useSetRecoilState } from "recoil"
import { name } from "../atoms"
export function Home() {

  const [playerName, setPlayerName] = useRecoilState<string>(name)

  const navigate = useNavigate();
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
  );
}
