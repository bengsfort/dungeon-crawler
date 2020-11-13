// Server interface for handling dungeon crawler connections

import {
  ClientConnectedMessage,
  ClientDisconnectedMessage,
  ConnectionHandshakeMessage,
  NetworkMessageBase,
} from "./messages";

import { Express } from "express";
import { WSCloseReasons } from "./common";
import WebSocket from "ws";
import expressWs from "express-ws";
import { now } from "@dungeon-crawler/core";
import { v4 as uuidv4 } from "uuid";

// @todo: think about how client and server pull and integrate events in main loops
// (try to synchronize 'update' ticks so physics events happen on a fixed timer)

const clients = new Map<string, WebSocket>();
let instance: expressWs.Instance | null = null;

const onClientClose = (id: string) => (ev: WebSocket.CloseEvent) => {
  console.log("[Networking] Client closed", id, ev.code, ev.reason);
  clients.delete(id);
  messageAllClients(new ClientDisconnectedMessage(id, now()));
};

const onClientMessage = (ev: WebSocket.MessageEvent) => {
  console.log("got message:", ev);
};

const onClientError = (ev: WebSocket.ErrorEvent) => {
  console.error("[Networking] Client errored:", ev.error, ev.message);
};

const onClientConnected: expressWs.WebsocketRequestHandler = (ws): void => {
  const id = uuidv4();
  const currentTime = now();
  const handshake = new ConnectionHandshakeMessage(id, true, currentTime);
  console.log("[Networking] New client connected (", id, ").");

  ws.send(handshake.toString());
  ws.onopen = (ev) => console.log("Client opened?", id, ev);
  ws.onclose = onClientClose(id);
  ws.onmessage = onClientMessage;
  ws.onerror = onClientError;

  clients.set(id, ws);
  messageAllClients(new ClientConnectedMessage(id, currentTime), [id]);
};

// Public methods
export const messageClient = <T extends NetworkMessageBase>(
  client: string,
  payload: T
): void => {
  if (instance === null) {
    console.error("Tried sending a message but the WS server is down!");
    return;
  }
  if (clients.has(client) === false) {
    console.error("Tried sending a message to a client that no longer exists!");
    return;
  }
  const ws = clients.get(client);
  ws?.send(payload.toString());
};

export const messageAllClients = <T extends NetworkMessageBase>(
  payload: T,
  ignore: string[] = []
): void => {
  if (instance === null) {
    console.error("Tried to send a message to a non-operating WS server");
    return;
  }
  clients.forEach((ws, id) => {
    if (ignore.includes(id)) return;
    ws.send(payload.toString());
  });
};

export const start = (expressApp: Express): expressWs.Application => {
  if (instance === null) instance = expressWs(expressApp);
  return instance.app;
};

export const setRoute = (route: string): void => {
  if (instance === null) return;
  instance.app.ws(route, onClientConnected);
};

export const stop = (): void => {
  if (instance === null) return;

  instance
    .getWss()
    .clients.forEach((ws) =>
      ws.close(WSCloseReasons.CLOSE_NORMAL, "CLOSE_NORMAL")
    );
};

export const update = (): void => {
  // @todo: implement
  // This is here for the case of having physics based messages handled
  // on a fixed time step that way the input and physics calculations all
  // feel smooth
};
