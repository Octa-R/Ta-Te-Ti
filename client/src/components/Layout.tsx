import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen bg-sky-900">
      <Header />
      <div className="container flex-grow p-10 w-full h-full m-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export { Layout };
