import {
  ClientAcknowledgementMessage,
  ClientConnectedMessage,
  ClientDisconnectedMessage,
  ConnectionHandshakeMessage,
} from "../messages";
import { Request, request } from "express";

import { WSCloseReasons } from "../common";
import WebSocket from "ws";
import { WsServer } from "../server";
import { validate } from "uuid";

jest.mock("ws");

const NOOP = () => {};

function requestMaker(id: string): Partial<Request> {
  return {
    signedCookies: {
      GameSessionAuth: id,
    },
  };
}

describe("WsServer", () => {
  it("should instantiate a message queue and client map", () => {
    const server = new WsServer();
    expect(server.clients.size).toEqual(0);
  });

  it("should add a client when there is a new connection", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);
    const client2ID = "client-2";
    const client2Socket = new WebSocket(client2ID);

    const server = new WsServer();
    expect(server.clients.size).toEqual(0);

    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    expect(server.clients.size).toEqual(1);
    const client1 = server.clients.get(client1ID);
    expect(client1?.id).toEqual(client1ID);

    server.clientConnectionHandler(
      // @ts-ignore
      client2Socket,
      requestMaker(client2ID),
      NOOP
    );
    expect(server.clients.size).toEqual(2);
    const client2 = server.clients.get(client2ID);
    expect(client2?.id).toEqual(client2ID);
  });

  it("should remove a client when it disconnects", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);
    const client2ID = "client-2";
    const client2Socket = new WebSocket(client2ID);

    const server = new WsServer();
    expect(server.clients.size).toEqual(0);

    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    expect(server.clients.size).toEqual(1);
    server.clientConnectionHandler(
      // @ts-ignore
      client2Socket,
      requestMaker(client2ID),
      NOOP
    );
    expect(server.clients.size).toEqual(2);

    client1Socket.onclose({
      code: 1,
      reason: WSCloseReasons.CLOSE_NORMAL,
      target: client1Socket,
      wasClean: true,
    });
    expect(server.clients.size).toEqual(1);
    expect(server.clients.get(client1ID)).toBeUndefined();
    client2Socket.onclose({
      code: 1,
      reason: WSCloseReasons.CLOSE_NORMAL,
      target: client2Socket,
      wasClean: true,
    });
    expect(server.clients.size).toEqual(0);
    expect(server.clients.get(client2ID)).toBeUndefined();
  });

  it("should emit an event when a connection opens and closes", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);
    const client2ID = "client-2";
    const client2Socket = new WebSocket(client2ID);

    const server = new WsServer();
    expect(server.clients.size).toEqual(0);

    server.onClientConnected = jest.fn();
    server.onClientDisconnected = jest.fn();
    expect(server.onClientConnected).toHaveBeenCalledTimes(0);
    expect(server.onClientDisconnected).toHaveBeenCalledTimes(0);

    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    client1Socket.onopen({ target: client1Socket });
    expect(server.onClientConnected).toHaveBeenCalledTimes(1);
    expect(server.onClientConnected).toHaveBeenLastCalledWith(client1ID);
    client1Socket.onclose({
      code: 1,
      reason: WSCloseReasons.CLOSE_NORMAL,
      target: client1Socket,
      wasClean: true,
    });
    expect(server.onClientDisconnected).toHaveBeenCalledTimes(1);
    expect(server.onClientDisconnected).toHaveBeenLastCalledWith(client1ID);

    server.clientConnectionHandler(
      // @ts-ignore
      client2Socket,
      requestMaker(client2ID),
      NOOP
    );
    client1Socket.onopen({ target: client1Socket });
    expect(server.onClientConnected).toHaveBeenCalledTimes(2);
    expect(server.onClientConnected).toHaveBeenLastCalledWith(client2ID);
    client2Socket.onclose({
      code: 1,
      reason: WSCloseReasons.CLOSE_NORMAL,
      target: client2Socket,
      wasClean: true,
    });
    expect(server.onClientDisconnected).toHaveBeenCalledTimes(2);
    expect(server.onClientDisconnected).toHaveBeenLastCalledWith(client2ID);
  });

  it("should be able to message 1 client directly", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);
    const client2ID = "client-2";

    const server = new WsServer();
    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    // Trigger the socket to open, then clear the send calls
    client1Socket.onopen({ target: client1Socket });
    // @ts-ignore
    expect(client1Socket.send).toHaveBeenCalledTimes(1);

    const message1 = new ClientConnectedMessage("bob", 0);
    const message2 = new ClientDisconnectedMessage("bob", 1);

    server.messageClient(client1ID, message1);
    expect(client1Socket.send).toHaveBeenCalledTimes(2);
    expect(client1Socket.send).toHaveBeenLastCalledWith(message1.toString());

    server.messageClient(client1ID, message2);
    expect(client1Socket.send).toHaveBeenCalledTimes(3);
    expect(client1Socket.send).toHaveBeenLastCalledWith(message2.toString());

    // Nonexistent client should not get any messages
    server.messageClient(client2ID, message1);
    expect(client1Socket.send).toHaveBeenCalledTimes(3);
  });

  it("should be able to message all connected clients, if not ignored", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);
    const client2ID = "client-2";
    const client2Socket = new WebSocket(client2ID);
    const client3ID = "client-3";
    const client3Socket = new WebSocket(client3ID);

    const server = new WsServer();
    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    // Trigger the socket to open, then clear the send calls
    client1Socket.onopen({ target: client1Socket });
    server.clientConnectionHandler(
      // @ts-ignore
      client2Socket,
      requestMaker(client2ID),
      NOOP
    );
    // Trigger the socket to open, then clear the send calls
    client2Socket.onopen({ target: client2Socket });
    server.clientConnectionHandler(
      // @ts-ignore
      client3Socket,
      requestMaker(client3ID),
      NOOP
    );
    // Trigger the socket to open, then clear the send calls
    client3Socket.onopen({ target: client3Socket });

    // @ts-ignore
    client1Socket.send.mockClear();
    // @ts-ignore
    client2Socket.send.mockClear();
    // @ts-ignore
    client3Socket.send.mockClear();

    const message1 = new ClientConnectedMessage("bob", 0);
    const message2 = new ClientDisconnectedMessage("bob", 1);

    server.messageAllClients(message1);
    expect(client1Socket.send).toHaveBeenCalledTimes(1);
    expect(client1Socket.send).toHaveBeenLastCalledWith(message1.toString());
    expect(client2Socket.send).toHaveBeenCalledTimes(1);
    expect(client2Socket.send).toHaveBeenLastCalledWith(message1.toString());
    expect(client3Socket.send).toHaveBeenCalledTimes(1);
    expect(client3Socket.send).toHaveBeenLastCalledWith(message1.toString());

    server.messageAllClients(message2, [client3ID]);
    expect(client1Socket.send).toHaveBeenCalledTimes(2);
    expect(client1Socket.send).toHaveBeenLastCalledWith(message2.toString());
    expect(client2Socket.send).toHaveBeenCalledTimes(2);
    expect(client2Socket.send).toHaveBeenLastCalledWith(message2.toString());
    expect(client3Socket.send).toHaveBeenCalledTimes(1);
    expect(client3Socket.send).toHaveBeenLastCalledWith(message1.toString());
  });

  it("should emit the client messages it receives", () => {
    const client1ID = "client-1";
    const client1Socket = new WebSocket(client1ID);

    const server = new WsServer();
    server.onClientAcknowledgement = jest.fn();
    server.clientConnectionHandler(
      // @ts-ignore
      client1Socket,
      requestMaker(client1ID),
      NOOP
    );
    // Trigger the socket to open, then clear the send calls
    client1Socket.onopen({ target: client1Socket });

    expect(server.onClientAcknowledgement).toHaveBeenCalledTimes(0);
    const client1Message = new ClientAcknowledgementMessage(5, 0);
    client1Socket.onmessage({
      target: client1Socket,
      type: `${client1Message.type}`,
      data: client1Message.toString(),
    });
    expect(server.onClientAcknowledgement).toHaveBeenCalledTimes(1);
    expect(server.onClientAcknowledgement).toHaveBeenCalledWith(
      client1ID,
      client1Message.tick
    );
  });
});
