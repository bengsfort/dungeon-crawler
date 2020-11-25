/**
 * Ideally, we'd have the following structure when live:
 * {
 *  "rooms": ["a1b2c3", "d4e5f6"],
 *  "rooms:count": 2,
 *  // Active room 1
 *  "room:a1b2c3": {
 *    "process": 1,
 *    "session": "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
 *  },
 *  "players:a1b2c3": {"foo": "playersSessionId", "bar": "playersSessionId" },
 *  "players:a1b2c3:max": 40,
 *  // Active room 2
 *  "room:d4e5f6": {
 *    "process": 2,
 *    "session": "75442486-0878-440c-9db1-a7006c25a39f",
 *  },
 *  "players:d4e5f6": { "bob": "sid", "saget": "sid", "jerry": "sid", "seinfeld": "sid" },
 *  "players:d4e5f6:max": 5
 * }
 */

export enum RedisKeys {
  // General state of game sessions/rooms
  Rooms = "rooms",
  RoomsCount = "rooms:count",
  // Individual game session/room state
  Room = "room:$id$",
  RoomPlayers = "players:$id$",
  RoomPlayersMax = "players:$id$:max",
}

export interface GameRoom {
  process: number;
  token: string; // randomly generated, must be retrieved from the server to join
}

export interface PlayerRecord {
  sessionId: string;
  username: string;
}

export interface RoomPlayerList {
  [playerSessionId: string]: string;
}

export const getRoomKey = (roomId: string): string =>
  RedisKeys.Room.replace("$id$", roomId);

export const getRoomPlayersKey = (roomId: string): string =>
  RedisKeys.RoomPlayers.replace("$id$", roomId);

export const getRoomPlayersMaxKey = (roomId: string): string =>
  RedisKeys.RoomPlayersMax.replace("$id$", roomId);
