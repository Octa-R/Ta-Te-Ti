import { notifications } from "@mantine/notifications";
import { useState } from "react";

export function useGameEndpoint() {
	const [isLoading, setIsLoading] = useState(false);
	interface FetchDataProps {
		playerName: string;
		action: string;
		mark?: string;
		roomId?: string;
	}
	async function fetchData(props: FetchDataProps) {
		const { mark, roomId, action, playerName } = props;
		setIsLoading(true);

		try {
			const res = await fetch(import.meta.env.VITE_BASE_URL + action, {
				method: "POST",
				body: JSON.stringify({ mark, name: playerName, roomId }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				const errorData = await res.json();
				if (Array.isArray(errorData.message)) {
					for (const msg of errorData.message) {
						notifications.show({
							message: msg,
							color: "red",
						});
					}
				} else if (typeof errorData.message === "string") {
					notifications.show({
						message: errorData.message,
						color: "red",
					});
				}
				throw new Error(errorData.message);
			}

			const json = await res.json();
			return json;
		} catch (error: any) {
			console.warn(error.message);
			notifications.show({
				message: error.message,
				color: "red",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	}
	return { isLoading, fetchData };
}
