export enum WSReadyState {
  Connecting = 0,
  Connected = 1,
  Closing = 2,
  Closed = 3,
}

// @see https://github.com/Luka967/websocket-close-codes
export enum WSCloseReasons {
  CLOSE_NORMAL = 1000,
}

export interface GameEnvSetup {
  world: string; // name of world
  roomId: string; // Room ID
}
