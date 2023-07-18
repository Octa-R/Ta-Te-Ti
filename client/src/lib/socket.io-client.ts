import { io, Socket } from "socket.io-client";
import { ClientToServerEvents } from "../events/client-to-server.events";
import { ServerToClientEvents } from "../events/server-to-client.events";
// please note that the types are reversed
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "localhost:3000",
  { autoConnect: false }
);
