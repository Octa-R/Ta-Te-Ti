export interface ClientToServerEvents {
  ["room::create"]: (data: any, callback: (res: any) => void) => void;
  ["room::game::join"]: (data: any, callback: (res: any) => void) => void;
  ["room::game::move"]: (data: any, callback: (res: any) => void) => void;
  ["room::game::quit"]: (data: any) => void;
  ["room::game::play_again"]: (data: any, callback: (res: any) => void) => void;
}
