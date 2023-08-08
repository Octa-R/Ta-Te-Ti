import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router/index.tsx";
import {
	RecoilRoot,
} from 'recoil';
import { MantineProvider } from '@mantine/core';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<RecoilRoot>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					<AppRoutes />
				</MantineProvider>
			</RecoilRoot>
		</BrowserRouter>
	</React.StrictMode>
);
