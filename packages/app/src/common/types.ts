// Setup
export interface EnvConfig {
  roomId: string;
  world: string;
}

// Networking
export interface CreateRoomRequest {
  username: string;
  world: string;
}

export interface CreateRoomResponse {
  roomId: string;
}

export interface CreateRoomError {
  code: number;
  error: string;
}

export interface JoinRoomRequest {
  username: string;
  roomId: string;
}

export interface JoinRoomResponse {
  roomId: string;
}

export interface JoinRoomError {
  code: number;
  error: string;
}
