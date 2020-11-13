import { Express } from "express";
import { WorkerManager } from "./workers";
import expressWs from "express-ws";

// from: https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
const createRoomId = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(0);

export const setupMaster = (app: expressWs.Application): void => {
  console.log("Setting up master worker");
  const workers = new WorkerManager();

  // @todo: This should also recieve the players username, and the level that should load
  app.post("/room/create", (req, res) => {
    // This is obviously garbage, just to test things out
    if (workers.hasAvailableWorker() === false) {
      res.status(503).send({ error: "No available rooms" });
      return;
    }

    // Create a random, readable room ID and create a fork
    // This will spawn a new process with an initialized, private runtime
    // and will set up a web socket server on the same port with a /{roomId} route.
    const roomId = createRoomId();
    if (workers.createRoomWorker(roomId) !== -1) {
      res.status(201).redirect(`/room/${roomId}`);
    } else {
      // @todo: better error handling
      res.status(500).send({ error: "Couldn't create room" });
    }
  });

  app.get("/", (req, res) => {
    res.render("index");
  });
};
