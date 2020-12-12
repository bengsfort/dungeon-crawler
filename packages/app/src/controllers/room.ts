import * as RedisCache from "../util/redis-interface";

import {
  CreateRoomError,
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomError,
  JoinRoomRequest,
} from "@dungeon-crawler/network";
import { NextFunction, Request, Response } from "express";

import { createGameSessionCookie } from "../util/cookies";
import { v4 as uuidv4 } from "uuid";
import { workers } from "../util/workers";

/**
 * @todo: Add more api's for checking server state/health
 *
 * POST room/create - create room, returns session + room ID
 * POST room/join - request to join a room (provide room ID), returns session? use session as url?
 * GET  room/play - actual play, must have room ID and have session)
 * GET  room/:roomid - get all room information
 * GET  room/:roomid/playercount - get the number of players in a game
 * GET  room/:roomid/players - get a list of all players in a room
 * GET  room/list - Get a list of all rooms
 * GET  room/count - Gets the number of active rooms
 *
 */

const createRoomId = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(0);

/**
 * Create a new game room.
 * @route POST /room/create
 */
export const postCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (workers.hasAvailableWorker() === false) {
    res.status(503).send({ error: "No available rooms" } as CreateRoomError);
    next();
  }

  try {
    const { username } = req.body as CreateRoomRequest;

    // Create a random, readable room ID and create a fork
    // This will spawn a new process with an initialized, private runtime
    // and will set up a web socket server on the same port with a /{roomId} route.
    const roomId = createRoomId();
    const token = uuidv4();
    const roomProcess = await workers.createRoomWorker(roomId);

    if (roomProcess !== -1) {
      console.log("Creating room " + roomId + "via player " + req.sessionID);
      await RedisCache.rooms.add(roomId, roomProcess, token, 40);
      await RedisCache.players.add(roomId, req.sessionID, username);
      createGameSessionCookie(res, token);
      res.status(200).send({ roomId } as CreateRoomResponse);
    } else {
      res
        .status(500)
        .send({ error: "Couldn't create room" } as CreateRoomError);
    }
  } catch (e) {
    next(e);
    console.error("There was an error:", e);
    res.status(500).send({ error: "Couldn't create room" });
  }
};

/**
 * Request to join an existing room.
 * @route POST /room/join
 */
export const postJoin = async (req: Request, res: Response) => {
  try {
    const { roomId, username } = req.body as JoinRoomRequest;
    console.log(`Player ${req.sessionID} trying to join room ${roomId}`);
    const { token } = await RedisCache.rooms.get(roomId);
    const playerCount = await RedisCache.players.countInRoom(roomId);
    const maxPlayers = await RedisCache.rooms.playerMax(roomId);
    const playerInRoom = await RedisCache.players.existsInRoom(
      roomId,
      req.sessionID
    );

    console.log(`Current players: ${playerCount} / ${maxPlayers}`);
    console.log(`${username} is in room already? ${playerInRoom}`);
    // Is there enough room?
    // Does this player already exist?
    if (playerCount < maxPlayers - 1 && playerInRoom === false) {
      await RedisCache.players.add(roomId, req.sessionID, username);
      createGameSessionCookie(res, token);
      res.status(200).json({ roomId, session: token } as CreateRoomResponse);
    } else {
      console.error("Couldn't join");
      res.status(500).send({ error: "Couldn't join room" } as JoinRoomError);
    }
  } catch (e) {
    console.error("There was an error:", e);
    res.status(500).send({ error: e });
  }
};
