import { InnerContainer } from "../components/InnerContainer";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export function Home() {


  const navigate = useNavigate();
  return (
    <InnerContainer>
      <Button
        onClick={() => {
          navigate("/create-game");
        }}
      >
        Crear nuevo juego
      </Button>
      <Button
        onClick={() => {
          navigate("/join-game");
        }}
      >
        Unirse a un juego
      </Button>
    </InnerContainer>
  );
}
