import { Header } from "components/ui/Header";
import { Footer } from "components/ui/Footer";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Layout() {
	const location = useLocation();
	console.log(location);
	return (
		<div className="h-screen bg-sky-900">
			<Header />
			<div className="container flex-grow p-10 w-full h-full m-auto">
				<Outlet />
			</div>
			{location.pathname === "/game" ? "" : <Footer />}
		</div>
	);
}

export { Layout };
