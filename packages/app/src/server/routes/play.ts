import { RedisCache } from "../util";
import { RequestCookies } from "../schema";
import express from "express";

export const playRouter = express.Router({ caseSensitive: true });

playRouter.get("/:roomId", async (req, res) => {
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
});
