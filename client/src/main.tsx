import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router/index.tsx";
import {
	RecoilRoot,
} from 'recoil';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<RecoilRoot>
				<AppRoutes />
			</RecoilRoot>
		</BrowserRouter>
	</React.StrictMode>
);

