import { PORT, WorkerType } from "./constants";

import { GameLoop } from "@dungeon-crawler/runtime";
import { Server } from "@dungeon-crawler/network";
import expressWs from "express-ws";

const WS_PORT = PORT - 1;

export const setupGameRoom = (app: expressWs.Application): void => {
  if (
    process.env.type === WorkerType.idle ||
    typeof process.env.roomId === "undefined"
  ) {
    console.log(`[GameRoom] Setting up idle worker.`);
    return;
  }

  console.log(`[GameRoom] Setting up game room with id: ${process.env.roomId}`);
  Server.setRoute(`/room/${process.env.roomId}`);
  GameLoop.start();
  app.listen(WS_PORT, () => {
    console.log(`[GameRoom] Running at port: ${WS_PORT}`);
  });
};
