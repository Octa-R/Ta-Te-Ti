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
      console.log({ mark, name: playerName });
      const res = await fetch(`http://localhost:3000/tateti/${action}`, {
        method: "POST",
        body: JSON.stringify({ mark, name: playerName, roomId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
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
        } else {
          console.log("No es ni un array ni un string");
        }
        throw new Error(errorData.message || "Error de servidor desconocido");
      }

      const json = await res.json();
      return json;
    } catch (error: any) {
      console.warn(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  return { isLoading, fetchData };
}
