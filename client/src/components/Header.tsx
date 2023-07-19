import { ConnectionState } from "../ui/ConnectionState"
import { socketConnectionState } from "../atoms"
import { useRecoilState } from "recoil"

function Header() {
  const [isConnected, setIsConnected] = useRecoilState(socketConnectionState)
  return (
    <header className="bg-slate-700 w-full fixed top-0 shadow-sm h-10 flex">
      <div className="container flex h-3/5 w-full m-auto flex-grow justify-center align-center items-center">
        <p className=" text-4xl  text-white font-black antialiased hover:subpixel-antialiased cursor-default">Ta-Te-Ti</p>

        {/* <ConnectionState isConnected={isConnected} /> */}
      </div>
    </header>
  );
}

export { Header };
