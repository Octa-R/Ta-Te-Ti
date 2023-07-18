import { Socket } from "socket.io-client";
import { ServerToClientEvents } from "./server-to-client.events";
import { ClientToServerEvents } from "./client-to-server.events";

export type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
