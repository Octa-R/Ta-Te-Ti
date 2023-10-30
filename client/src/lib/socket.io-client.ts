import { io, Socket } from "socket.io-client";
import { ClientToServerEvents } from "../interfaces/client-to-server.events";
import { ServerToClientEvents } from "../interfaces/server-to-client.events";
// please note that the types are reversed
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_BASE_URL,
  { autoConnect: false }
);
