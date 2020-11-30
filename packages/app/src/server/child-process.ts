import { GameLoop, World } from "@dungeon-crawler/runtime";

import { Sandbox } from "@dungeon-crawler/world-configs";
import { Server } from "@dungeon-crawler/network";
import { WorkerType } from "./constants";
import expressWs from "express-ws";

export const setupChildProcess = (app: expressWs.Application): void => {
  if (
    process.env.WORKER_TYPE === WorkerType.idle ||
    typeof process.env.ROOM_ID === "undefined"
  ) {
    console.log(`[GameRoom] Setting up idle worker.`);
    return;
  }

  console.log(
    `[GameRoom] Setting up game room with id: ${process.env.ROOM_ID}`
  );
  Server.setRoute(`/play/${process.env.ROOM_ID}`);
  GameLoop.setFixedTickrate(true, 30);
  GameLoop.start(() => {
    const world = new World(Sandbox.map);
    console.log("World created:", world.name);
  });
  app.listen(process.env.WEBSOCKET_PORT, () => {
    console.log(`[GameRoom] Running at port: ${process.env.WEBSOCKET_PORT}`);
  });
};

// When creating each game entity, it should add a "state snapshot" component
// This component is in charge of taking snapshots to send to the client every network tick
// It should report DELTA'S  of changes, so if someone is AFK it should do nothing and report nothing
// This will make it easier for the client to manage changes
