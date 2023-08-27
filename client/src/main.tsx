import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router/index.tsx";
import {
	RecoilRoot,
} from 'recoil';
import { MantineProvider } from '@mantine/core';
import "./index.css";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<RecoilRoot>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<Notifications />
					<AppRoutes />
				</MantineProvider>
			</RecoilRoot>
		</BrowserRouter>
	</React.StrictMode>
);
