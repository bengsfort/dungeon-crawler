import { registerUpdateHandler, removeUpdateHandler } from "../../game-loop";

import { Request } from "express";
import { ServerStateController } from "../server-state-controller";
import WebSocket from "ws";
import { WsServer } from "@dungeon-crawler/network";

jest.useFakeTimers();
jest.mock("ws");
// need to better mock this....
jest.mock("../../game-loop", () => {
  return {
    registerUpdateHandler: jest.fn(),
    removeUpdateHandler: jest.fn(),
  };
});

describe("ServerStateController", () => {
  const server = new WsServer();

  it("should initialize at tick 0", () => {
    const serverController = new ServerStateController(server);
    expect(serverController.CurrentTick).toEqual(0);
  });
});
