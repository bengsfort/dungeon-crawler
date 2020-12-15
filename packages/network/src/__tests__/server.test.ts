import {
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
    const clientSocket = new WebSocket("client-1");

    const server = new WsServer();
    expect(server.clients.size).toEqual(0);

    //@ts-ignore
    server.clientConnectionHandler(clientSocket, requestMaker("client-1"));
    expect(server.clients.size).toEqual(1);
    const client1 = server.clients.get("client-1");

    expect(server.clients.get("client-1")?.id).toEqual("client-1");
  });
});
