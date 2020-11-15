/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Server } from "@dungeon-crawler/network";
import { WorkerType } from "./constants";

export const setupGameRoom = (): void => {
  if (
    process.env.type === WorkerType.idle ||
    typeof process.env.roomId === "undefined"
  ) {
    console.log(`[GameRoom] Setting up idle worker.`);
    return;
  }
  console.log(`[GameRoom] Setting up game room with id: ${process.env.roomId}`);
  Server.setRoute(`/room/${process.env.roomId}`);
};
