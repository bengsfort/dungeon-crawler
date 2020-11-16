import { CreateRoomError, CreateRoomResponse } from "@dungeon-crawler/network";

import express from "express";
import { workers } from "../workers";

const rooms: string[] = [];
const createRoomId = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(0);

export const roomRouter = express.Router({ caseSensitive: true });

roomRouter.post("/create", (req, res, next) => {
  // This is obviously garbage, just to test things out
  if (workers.hasAvailableWorker() === false) {
    res.status(503).send({ error: "No available rooms" } as CreateRoomError);
    return next();
  }

  // Create a random, readable room ID and create a fork
  // This will spawn a new process with an initialized, private runtime
  // and will set up a web socket server on the same port with a /{roomId} route.
  const roomId = createRoomId();
  if (workers.createRoomWorker(roomId) !== -1) {
    rooms.push(roomId);
    res.status(200).send({ roomId } as CreateRoomResponse);
    next();
  } else {
    // @todo: better error handling
    res.status(500).send({ error: "Couldn't create room" } as CreateRoomError);
    next();
  }
});

roomRouter.get("/:roomId", (req, res, next) => {
  // if room exists && room is not full, THEN ->
  const { roomId } = req.params;
  console.log("join header content type:", req.headers["content-type"]);
  if (rooms.includes(roomId)) {
    res.render("room", { roomId: roomId });
  } else {
    res.status(404).send("Room does not exist");
  }
  next();
});
