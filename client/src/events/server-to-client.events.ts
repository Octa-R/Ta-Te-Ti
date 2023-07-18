export interface ServerToClientEvents {
  ["room::game::state"]: (state: any) => void;
  ["room::game::over"]: () => void;
  ["room::closed"]: () => void;
  ["room::opened"]: (roomId: string) => void;
}
