/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ClientAcknowledgementMessage,
  ServerStateUpdateMessage,
  WSCloseReasons,
  WsServer,
} from "@dungeon-crawler/network";

import { PartialSerializeableGameState } from "../../state";
import { PlayerCharacter } from "../../entities";
import { Request } from "express";
import { ServerStateController } from "../server-state-controller";
import { Status } from "../../components";
import WebSocket from "ws";
import { registerPostUpdateHandler } from "../../game-loop";

jest.useFakeTimers();
jest.mock("ws");
jest.mock("../../game-loop");

const NOOP = () => {};
function requestMaker(id: string): Partial<Request> {
  return {
    signedCookies: {
      GameSessionAuth: id,
    },
  };
}

/**
 * Note: These are more like integration tests rather than unit tests,
 * and that is intentional :)
 */
describe("ServerStateController", () => {
  const server = new WsServer();

  it("should initialize at tick 0", () => {
    const serverController = new ServerStateController(server);
    serverController.setActive(true);
    expect(registerPostUpdateHandler).toHaveBeenCalledTimes(1);
    expect(serverController.CurrentTick).toEqual(0);
    expect(serverController.HistoryLength).toEqual(0);
  });

  it("should emit a new player instance when a client connects", () => {
    const serverController = new ServerStateController(server);
    serverController.onNewPlayer = jest.fn();
    serverController.onPlayerDisconnected = jest.fn();
    serverController.setActive(true);
    expect(serverController.TrackedEntityCount).toEqual(0);

    const clientId = "client-1";
    const clientSocket = new WebSocket(clientId);
    server.clientConnectionHandler(
      // @ts-ignore
      clientSocket,
      requestMaker(clientId),
      NOOP
    );

    expect(serverController.TrackedEntityCount).toEqual(1);
    expect(serverController.onNewPlayer).toHaveBeenCalledTimes(1);

    clientSocket.onclose({
      wasClean: true,
      code: 1000,
      reason: WSCloseReasons.CLOSE_NORMAL,
      target: clientSocket,
    });
    expect(serverController.TrackedEntityCount).toEqual(0);
    expect(serverController.onPlayerDisconnected).toHaveBeenCalledTimes(1);
  });

  it("should increment the tick and store the last state in the history", () => {
    const serverController = new ServerStateController(server);
    serverController.setActive(true);
    expect(serverController.CurrentTick).toEqual(0);
    expect(serverController.HistoryLength).toEqual(0);

    serverController.tick();
    expect(serverController.CurrentTick).toEqual(1);
    expect(serverController.HistoryLength).toEqual(1);
  });

  it("should only store the specified amount of history snapshots", () => {
    const serverController = new ServerStateController(server, 10, 5);
    serverController.setActive(true);
    expect(serverController.CurrentTick).toEqual(0);
    expect(serverController.HistoryLength).toEqual(0);

    for (let i = 0; i < 15; i++) {
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(i + 1);
      expect(serverController.HistoryLength).toEqual(Math.min(i + 1, 10));
    }
    expect(serverController.HistoryLength).toBeLessThanOrEqual(10);
  });

  it("should store the last state acknowledgement for each client", () => {
    const serverController = new ServerStateController(server);
    serverController.setActive(true);

    const clientId = "client-1";
    const clientSocket = new WebSocket(clientId);
    server.clientConnectionHandler(
      // @ts-ignore
      clientSocket,
      requestMaker(clientId),
      NOOP
    );
    clientSocket.onopen({ target: clientSocket });

    expect(serverController.getLastClientAcknowledgement(clientId)).toEqual(-1);
    clientSocket.onmessage({
      type: "message",
      data: new ClientAcknowledgementMessage(0).toString(),
      target: clientSocket,
    });
    expect(serverController.getLastClientAcknowledgement(clientId)).toEqual(0);
    clientSocket.onmessage({
      type: "message",
      data: new ClientAcknowledgementMessage(1).toString(),
      target: clientSocket,
    });
    expect(serverController.getLastClientAcknowledgement(clientId)).toEqual(1);
  });

  it("should return the diff between the last acknowledged state and the current state", () => {
    const serverController = new ServerStateController(server);
    serverController.setActive(true);

    let entityInstance: PlayerCharacter | undefined;
    let acknowledgement: ClientAcknowledgementMessage;
    let stateMessage: ServerStateUpdateMessage<PartialSerializeableGameState>;

    serverController.onNewPlayer = jest.fn((player) => {
      entityInstance = player;
    });

    const clientId = "client-1";
    const clientSocket = new WebSocket(clientId);
    clientSocket.send = jest.fn();
    server.clientConnectionHandler(
      // @ts-ignore
      clientSocket,
      requestMaker(clientId),
      NOOP
    );
    clientSocket.onopen({ target: clientSocket });
    expect(serverController.onNewPlayer).toHaveBeenCalled();
    expect(entityInstance).not.toBeNull();

    if (typeof entityInstance !== "undefined") {
      // First tick sequence
      serverController.tick();
      acknowledgement = new ClientAcknowledgementMessage(0);
      stateMessage = new ServerStateUpdateMessage(
        {
          tick: 0,
          entities: {
            "client-1": {
              position: entityInstance.transform.position.toLiteral(),
              scale: entityInstance.transform.scale.toLiteral(),
              hp: entityInstance.status.hp,
              power: entityInstance.status.power,
              displayName: entityInstance.status.displayName,
              target: entityInstance.status.target,
            },
          },
        },
        -1
      );
      clientSocket.onmessage({
        type: "message",
        data: acknowledgement.toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        stateMessage.toString()
      );

      // Player info changes
      entityInstance.status = new Status(220, 100, 100, clientId);
      entityInstance.status.displayName = "Bobby";
      serverController.tick();
      acknowledgement = new ClientAcknowledgementMessage(1);
      stateMessage = new ServerStateUpdateMessage(
        {
          tick: 1,
          entities: {
            "client-1": {
              displayName: entityInstance.status.displayName,
              hp: entityInstance.status.hp,
            },
          },
        },
        -1
      );
      clientSocket.onmessage({
        type: "message",
        data: acknowledgement.toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        stateMessage.toString()
      );

      // Player moves, skips 1 acknowledgement
      entityInstance.transform.position.x = 3;
      entityInstance.transform.position.y = 1;
      serverController.tick(); // tick 2
      stateMessage = new ServerStateUpdateMessage(
        {
          tick: 2,
          entities: {
            "client-1": {
              position: {
                x: 3,
                y: 1,
              },
            },
          },
        },
        -1
      );
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        stateMessage.toString()
      );
      entityInstance.transform.position.x = 5;
      serverController.tick(); // tick 3
      acknowledgement = new ClientAcknowledgementMessage(3);
      stateMessage = new ServerStateUpdateMessage(
        {
          tick: 3,
          entities: {
            "client-1": {
              position: {
                x: 5,
                y: 1,
              },
            },
          },
        },
        -1
      );
      clientSocket.onmessage({
        type: "message",
        data: acknowledgement.toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        stateMessage.toString()
      );
    }
  });

  it("should return a full update if the last acknowledgement exceeds the full diff delta", () => {
    // set this up to only hold 5 at a time and the "full diff delta" be 3
    const serverController = new ServerStateController(server, 5, 3);
    serverController.setActive(true);

    let entityInstance: PlayerCharacter | undefined;
    serverController.onNewPlayer = jest.fn((player) => {
      entityInstance = player;
    });

    const clientId = "client-1";
    const clientSocket = new WebSocket(clientId);
    clientSocket.send = jest.fn();
    server.clientConnectionHandler(
      // @ts-ignore
      clientSocket,
      requestMaker(clientId),
      NOOP
    );
    clientSocket.onopen({ target: clientSocket });
    expect(serverController.onNewPlayer).toHaveBeenCalled();
    expect(entityInstance).not.toBeNull();

    if (typeof entityInstance !== "undefined") {
      expect(serverController.CurrentTick).toEqual(0);
      expect(serverController.HistoryLength).toEqual(0);

      // First tick sequence
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(1);
      expect(serverController.HistoryLength).toEqual(1);
      clientSocket.onmessage({
        type: "message",
        data: new ClientAcknowledgementMessage(0).toString(),
        target: clientSocket,
      });
      expect(serverController.getLastClientAcknowledgement(clientId)).toEqual(
        0
      );
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 0,
            entities: {
              "client-1": {
                position: entityInstance.transform.position.toLiteral(),
                scale: entityInstance.transform.scale.toLiteral(),
                hp: entityInstance.status.hp,
                power: entityInstance.status.power,
                displayName: entityInstance.status.displayName,
                target: entityInstance.status.target,
              },
            },
          },
          -1
        ).toString()
      );

      serverController.tick();
      expect(serverController.CurrentTick).toEqual(2);
      expect(serverController.HistoryLength).toEqual(2);
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 1,
            entities: {
              "client-1": {},
            },
          },
          -1
        ).toString()
      );

      serverController.tick();
      expect(serverController.CurrentTick).toEqual(3);
      expect(serverController.HistoryLength).toEqual(3);

      serverController.tick();
      expect(serverController.CurrentTick).toEqual(4);
      expect(serverController.HistoryLength).toEqual(4);
      clientSocket.onmessage({
        type: "message",
        data: new ClientAcknowledgementMessage(3).toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 3,
            entities: {
              "client-1": {
                position: entityInstance.transform.position.toLiteral(),
                scale: entityInstance.transform.scale.toLiteral(),
                hp: entityInstance.status.hp,
                power: entityInstance.status.power,
                displayName: entityInstance.status.displayName,
                target: entityInstance.status.target,
              },
            },
          },
          -1
        ).toString()
      );

      entityInstance.transform.position.x = 5;
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(5);
      expect(serverController.HistoryLength).toEqual(5);
      clientSocket.onmessage({
        type: "message",
        data: new ClientAcknowledgementMessage(4).toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 4,
            entities: {
              "client-1": {
                position: {
                  x: 5,
                  y: 0,
                },
              },
            },
          },
          -1
        ).toString()
      );

      entityInstance.transform.position.x = 7;
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(6);
      expect(serverController.HistoryLength).toEqual(5);
      clientSocket.onmessage({
        type: "message",
        data: new ClientAcknowledgementMessage(5).toString(),
        target: clientSocket,
      });
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 5,
            entities: {
              "client-1": {
                position: {
                  x: 7,
                  y: 0,
                },
              },
            },
          },
          -1
        ).toString()
      );

      serverController.tick();
      expect(serverController.CurrentTick).toEqual(7);
      expect(serverController.HistoryLength).toEqual(5);
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(8);
      expect(serverController.HistoryLength).toEqual(5);
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(9);
      expect(serverController.HistoryLength).toEqual(5);
      entityInstance.transform.position.x = 3;
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(10);
      expect(serverController.HistoryLength).toEqual(5);
      serverController.tick();
      expect(serverController.CurrentTick).toEqual(11);
      expect(serverController.HistoryLength).toEqual(5);
      expect(clientSocket.send).toHaveBeenLastCalledWith(
        new ServerStateUpdateMessage(
          {
            tick: 10,
            entities: {
              "client-1": {
                position: { x: 3, y: 0 },
                scale: entityInstance.transform.scale.toLiteral(),
                hp: entityInstance.status.hp,
                power: entityInstance.status.power,
                displayName: entityInstance.status.displayName,
                target: entityInstance.status.target,
              },
            },
          },
          -1
        ).toString()
      );
    }
  });
});
