import { Route, Routes } from "react-router-dom";
import { Layout } from "../ui/Layout";
import { Home } from "../pages/Home";
import { Game } from "../pages/Game";
import { CreateGame } from "../pages/CreateGame";
import { JoinGame } from "../pages/JoinGame";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create-game" element={<CreateGame />} />
        <Route path="join-game" element={<JoinGame />} />
        <Route path="game" element={<Game />} />
      </Route>
    </Routes>
  );
}

export { AppRoutes };
