import { ConnectionState } from "../ui/ConnectionState"
import { socketConnectionState, currentRoomId } from "../atoms"
import { useRecoilValue, useRecoilState } from "recoil"
function Header() {
  const [isConnected, setIsConnected] = useRecoilState(socketConnectionState)
  const roomId = useRecoilValue(currentRoomId)
  return (
    <header className="bg-blue-500 w-full fixed top-0 shadow-sm h-10 flex">
      <div className="container flex h-3/5 w-full m-auto flex-grow justify-center align-center items-center">

        Mi TATETI RE Locooooooooooooooo{" "}
        <ConnectionState isConnected={isConnected} />
        {roomId}
      </div>
    </header>
  );
}

export { Header };
