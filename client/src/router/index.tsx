import { Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Home } from "../pages/Home";
import { Game } from "../pages/Game";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="game" element={<Game />} />
      </Route>
    </Routes>
  );
}

export { AppRoutes };
