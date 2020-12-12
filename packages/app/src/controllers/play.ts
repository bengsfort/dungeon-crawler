import * as RedisCache from "../util/redis-interface";

import { Request, Response } from "express";

import { RequestCookies } from "../util/cookies";

/**
 * Render a successfully joined game room.
 * @route GET /play/:roomId
 */
export const getRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const sessionId = (req.signedCookies as RequestCookies).GameSessionAuth;
    const room = await RedisCache.rooms.get(roomId);

    if (room.token !== sessionId)
      throw new Error(
        `The current token doesn't match the room token! (${sessionId})`
      );

    const exists = await RedisCache.players.existsInRoom(roomId, req.sessionID);
    if (exists === false)
      throw new Error(
        `Player does not belong to this room ID! (${req.sessionID})`
      );

    res.render("room", { roomId });
  } catch (e) {
    console.error("oopsie player doesn't belong", e);
    res.status(500).send({ error: e });
  }
};
