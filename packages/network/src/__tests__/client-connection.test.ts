import {
  ClientConnectedMessage,
  ClientDisconnectedMessage,
  ConnectionHandshakeMessage,
} from "../messages";

import { ClientConnection } from "../client-connection";
import { WSCloseReasons } from "../common";
import WebSocket from "ws";
import { validate } from "uuid";

jest.mock("ws");

describe("ClientConnection", () => {
  it("should create an ID if not given one", () => {
    const socket = new WebSocket("test");
    const client1 = new ClientConnection(socket, "given-id");
    const client2 = new ClientConnection(socket);

    expect(client1.id).toEqual("given-id");
    expect(validate(client2.id)).toEqual(true);
  });

  it("should send a handshake message on creation", () => {
    const socket = new WebSocket("test");
    expect(socket.send).not.toHaveBeenCalled();

    const client = new ClientConnection(socket, "custom-id");
    const handshake = new ConnectionHandshakeMessage(
      "custom-id",
      true,
      client.connectTime
    );
    socket.onopen({ target: socket });
    expect(socket.send).toHaveBeenNthCalledWith(1, handshake.toString());
  });

  it("should send queued messages when connection opens", () => {
    const socket = new WebSocket("test");
    const client = new ClientConnection(socket);
    expect(client.Ready).toEqual(false);
    expect(client.MessageQueueLength).toEqual(1);

    client.message(new ClientConnectedMessage("some-client", 0));
    client.message(new ClientConnectedMessage("another-client", 0));
    client.message(new ClientConnectedMessage("another-another-client", 0));
    expect(client.MessageQueueLength).toEqual(4);

    expect(socket.send).toHaveBeenCalledTimes(0);
    socket.onopen({ target: socket });
    expect(client.Ready).toEqual(true);
    expect(socket.send).toHaveBeenCalledTimes(4); // +1 for the handshake
    expect(client.MessageQueueLength).toEqual(0);
  });

  it("should close itself and report closure when client disconnects", () => {
    const socket = new WebSocket("test");
    const client = new ClientConnection(socket);
    client.onClose = jest.fn();

    // Open connection
    socket.onopen({ target: socket });
    expect(client.onClose).toHaveBeenCalledTimes(0);
    expect(client.Ready).toEqual(true);

    // Close
    socket.onclose({
      reason: WSCloseReasons.CLOSE_NORMAL,
      code: 1,
      wasClean: true,
      target: socket,
    });
    expect(client.onClose).toHaveBeenCalledTimes(1);
    expect(client.onClose).toHaveBeenCalledWith(client.id);
    expect(client.Ready).toEqual(false);
  });

  it("should pass along messages with its client id", () => {
    const socket = new WebSocket("test");
    const client = new ClientConnection(socket);
    client.onMessage = jest.fn();

    // Open connection
    socket.onopen({ target: socket });
    expect(client.onMessage).toHaveBeenCalledTimes(0);

    // Message 1
    const message1 = new ClientConnectedMessage("bobby", 0);
    socket.onmessage({
      target: socket,
      type: `${message1.type}`,
      data: message1.toString(),
    });
    expect(client.onMessage).toHaveBeenCalledTimes(1);
    expect(client.onMessage).toHaveBeenCalledWith(client.id, message1);

    const message2 = new ClientDisconnectedMessage("bobby", 0);
    socket.onmessage({
      target: socket,
      type: `${message1.type}`,
      data: message2.toString(),
    });
    expect(client.onMessage).toHaveBeenCalledTimes(2);
    expect(client.onMessage).toHaveBeenCalledWith(client.id, message2);
  });
});
