import {ConnectionState} from "../ui/ConnectionState"
import {socketConnectionState,currentGameRoom } from "../atoms"
import{useRecoilValue,useRecoilState} from "recoil"
function Header() {
  const [isConnected,setIsConnected] = useRecoilState(socketConnectionState)
  const gameRoomCode = useRecoilValue(currentGameRoom)
  return (
    <header className="bg-blue-500 w-full fixed top-0 shadow-sm h-10 flex">
      <div className="container flex h-3/5 w-full m-auto flex-grow justify-center align-center items-center">

      Mi TATETI RE Locooooooooooooooo{" "}
      <ConnectionState isConnected={isConnected}/>
      {gameRoomCode}
      </div>
    </header>
  );
}

export { Header };
