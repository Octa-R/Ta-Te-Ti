export interface ClientToServerEvents {
  ["room::create"]: (data: any, callback: (data: any) => void) => void;
  ["room::game::init"]: () => void;
  ["room::game::join"]: () => void;
  ["room::game::move"]: () => void;
  ["room::game::quit"]: () => void;
}
