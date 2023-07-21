import { InnerContainer } from "../components/InnerContainer";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export function Home() {


  const navigate = useNavigate();
  return (
    <div className="flex bg-sky-700 flex-col w-full h-full items-center justify-center gap-4 p-4">
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
    </div>
  );
}
