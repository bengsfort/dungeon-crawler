// Networking
export interface CreateRoomRequest {
  username: string;
  world: string;
}

export interface CreateRoomResponse {
  roomId: string;
  session: string;
  error?: string;
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
  session: string;
  error?: string;
}

export interface JoinRoomError {
  code: number;
  error: string;
}
