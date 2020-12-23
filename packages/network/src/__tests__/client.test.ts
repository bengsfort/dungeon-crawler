import {
  ClientAcknowledgementMessage,
  ConnectionHandshakeMessage,
  ServerStateUpdateMessage,
} from "../messages";

import { Vector2 } from "@dungeon-crawler/core";
import WS from "jest-websocket-mock";
import { WsClient } from "../client";

interface FakeStateUpdate {
  position: Vector2;
  scale: Vector2;
}

const TIMEOUT = 5000;
describe("WsClient", () => {
  beforeEach(() => {
    WS.clean();
  });

  it(
    "should connect to the given URL",
    async () => {
      const server = new WS("ws://localhost:3001");
      const client = new WsClient("ws://localhost:3001");
      await server.connected;
      client._connection.send("hello");
      await expect(server).toReceiveMessage("hello");
      expect(client.isConnected).toEqual(true);
      server.close();
    },
    TIMEOUT
  );

  it(
    "should send a message to the server",
    async () => {
      const server = new WS("ws://localhost:3001");
      const client = new WsClient("ws://localhost:3001");
      await server.connected;
      const message = new ClientAcknowledgementMessage(1, Date.now());
      client.sendMessage(message);
      await expect(server).toReceiveMessage(message.toString());
      server.close();
    },
    TIMEOUT
  );

  it(
    "should emit an onConnectionApproved event when connected",
    async () => {
      const server = new WS("ws://localhost:3001");
      const client = new WsClient("ws://localhost:3001");
      client.onConnectionApproved = jest.fn();
      await server.connected;
      const handshake = new ConnectionHandshakeMessage("foo", true, Date.now());
      server.send(handshake.toString());
      expect(client.onConnectionApproved).toHaveBeenCalledTimes(1);
      expect(client.onConnectionApproved).toHaveBeenLastCalledWith(handshake);
      server.close();
    },
    TIMEOUT
  );

  it(
    "should emit an onServerStateUpdated event when receiving an update",
    async () => {
      const server = new WS("ws://localhost:3001");
      const client = new WsClient("ws://localhost:3001");
      client.onServerStateUpdate = jest.fn();
      await server.connected;
      const stateUpdate = new ServerStateUpdateMessage<FakeStateUpdate>(
        {
          position: Vector2.Zero,
        },
        Date.now()
      );
      server.send(stateUpdate.toString());
      expect(client.onServerStateUpdate).toHaveBeenCalledTimes(1);
      expect(client.onServerStateUpdate).toHaveBeenLastCalledWith(stateUpdate);
      server.close();
    },
    TIMEOUT
  );
});
