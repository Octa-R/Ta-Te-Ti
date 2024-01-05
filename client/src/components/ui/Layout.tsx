import { Header } from "components/ui/Header";
import { Footer } from "components/ui/Footer";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentGameStatus } from "atoms";

function Layout() {
	const gameStatus = useRecoilValue(currentGameStatus);
	return (
		<div className="h-screen bg-sky-900">
			<Header />
			<div className="container flex-grow p-10 w-full h-full m-auto">
				<Outlet />
			</div>
			{gameStatus ? "" : <Footer />}
		</div>
	);
}

export { Layout };
