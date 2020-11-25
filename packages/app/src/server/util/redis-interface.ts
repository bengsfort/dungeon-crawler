import {
  GameRoom,
  PlayerRecord,
  RedisKeys,
  RoomPlayerList,
  getRoomKey,
  getRoomPlayersKey,
  getRoomPlayersMaxKey,
} from "../schema";

import Redis from "ioredis";

export const client = new Redis(6379, "redis");
client.on("error", console.error);

const addRoom = async (
  roomId: string,
  processId: number,
  token: string,
  maxPlayers: number
): Promise<boolean> => {
  try {
    await client.sadd(RedisKeys.Rooms, roomId);
    await client.hmset(getRoomKey(roomId), {
      process: processId,
      token: token,
    });
    await client.set(getRoomPlayersMaxKey(roomId), maxPlayers.toString());
    await client.incr(RedisKeys.RoomsCount);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

const deleteRoom = async (roomId: string): Promise<boolean> => {
  try {
    await client.del(getRoomKey(roomId));
    await client.decr(RedisKeys.RoomsCount);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

const getRoom = async (roomId: string): Promise<GameRoom> => {
  try {
    const [processId, token] = await client.hmget(
      getRoomKey(roomId),
      "process",
      "token"
    );
    return {
      process: parseInt(processId as string, 10),
      token: token as string,
    };
  } catch (e) {
    throw new Error(e);
  }
};

const getRoomMaxPlayerCount = async (roomId: string): Promise<number> => {
  try {
    const max = await client.get(getRoomPlayersMaxKey(roomId));
    return parseInt(max || "", 10);
  } catch (e) {
    throw new Error(e);
  }
};

const getRoomPlayerCount = async (roomId: string): Promise<number> => {
  try {
    return await client.hlen(getRoomPlayersKey(roomId));
  } catch (e) {
    throw new Error(e);
  }
};

export const getRoomPlayers = async (
  roomId: string
): Promise<RoomPlayerList> => {
  try {
    return await client.hgetall(getRoomPlayersKey(roomId));
  } catch (e) {
    throw new Error(e);
  }
};

const addPlayer = async (
  roomId: string,
  playerSessionId: string,
  playerName: string
): Promise<void> => {
  try {
    await client.hset(getRoomPlayersKey(roomId), playerSessionId, playerName);
  } catch (e) {
    throw new Error(e);
  }
};

const getPlayer = async (
  roomId: string,
  playerSessionId: string
): Promise<PlayerRecord | null> => {
  try {
    const username = await client.hget(
      getRoomPlayersKey(roomId),
      playerSessionId
    );
    if (username !== null) {
      return {
        username,
        sessionId: playerSessionId,
      };
    }
    return null;
  } catch (e) {
    throw new Error(e);
  }
};

const getPlayerExists = async (
  roomId: string,
  playerSessionId: string
): Promise<boolean> => {
  try {
    return (
      (await client.hexists(getRoomPlayersKey(roomId), playerSessionId)) === 1
    );
  } catch (e) {
    throw new Error(e);
  }
};

const getNumRooms = async (): Promise<number> => {
  try {
    return await client.scard(RedisKeys.Rooms);
  } catch (e) {
    throw new Error(e);
  }
};

const listRooms = async (): Promise<GameRoom[]> => {
  try {
    const ids = await client.smembers(RedisKeys.Rooms);
    return Promise.all(ids.map((id: string) => getRoom(id)));
  } catch (e) {
    throw new Error(e);
  }
};

export const rooms = {
  add: addRoom,
  get: getRoom,
  delete: deleteRoom,
  list: listRooms,
  count: getNumRooms,
  playerMax: getRoomMaxPlayerCount,
};

export const players = {
  add: addPlayer,
  get: getPlayer,
  existsInRoom: getPlayerExists,
  listInRoom: getRoomPlayers,
  maxInRoom: getRoomMaxPlayerCount,
  countInRoom: getRoomPlayerCount,
};
