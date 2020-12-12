// Server interface for handling dungeon crawler connections

import {
  ClientAcknowledgementMessage,
  MessageTypes,
  NetworkMessageBase,
} from "./messages";
import {
  ClientConnection,
  OnCloseEventHandler,
  OnMessageEventHandler,
} from "./client-connection";

import { NOOP } from "./common";
import expressWs from "express-ws";

export type ClientAcknowledgementHandler = (
  clientId: string,
  tick: number
) => void;
export type ClientJoinedHandler = (clientId: string) => void;
export type ClientDisconnectedHandler = (clientId: string) => void;

export class WsServer {
  onClientConnected: ClientJoinedHandler = NOOP;
  onClientDisconnected: ClientDisconnectedHandler = NOOP;
  onClientAcknowledgement: ClientAcknowledgementHandler = NOOP;

  clients: Map<string, ClientConnection>;

  private _app: expressWs.Application;
  private _queue: NetworkMessageBase[];

  constructor(app: expressWs.Application) {
    this._app = app;
    this.clients = new Map<string, ClientConnection>();
    this._queue = [];
  }

  clientConnectionHandler: expressWs.WebsocketRequestHandler = (ws, req) => {
    const id: string = req.signedCookies?.GameSessionAuth;
    const client = new ClientConnection(ws, id);
    client.onMessage = this._onClientMessage;
    client.onClose = this._onClientClose;
    this.clients.set(id, client);
    this.onClientConnected(id);
  };

  _onClientMessage: OnMessageEventHandler = (id, data) => {
    switch (data.type) {
      case MessageTypes.ClientAcknowledgement:
        console.log(
          "Got acknowledgement from client:",
          id,
          "(tick:",
          (data as ClientAcknowledgementMessage).tick
        );
        this.onClientAcknowledgement(
          id,
          (data as ClientAcknowledgementMessage).tick
        );
        break;
      default:
        console.log("[Networking] Got unidentified message, ignoring.");
        break;
    }
  };

  _onClientClose: OnCloseEventHandler = (id) => {
    this.clients.delete(id);
    this.onClientDisconnected(id);
  };

  messageClient = <T extends NetworkMessageBase>(
    clientId: string,
    payload: T
  ): void => {
    if (this._app === null) {
      console.error("Tried sending a message but the WS server is down!");
      return;
    }
    if (this.clients.has(clientId) === false) {
      console.error(
        "Tried sending a message to a client that no longer exists!"
      );
      return;
    }
    const connection = this.clients.get(clientId);
    connection?.message(payload);
  };

  messageAllClients = <T extends NetworkMessageBase>(
    payload: T,
    ignore: string[] = []
  ): void => {
    if (this._app === null) {
      console.error("Tried to send a message to a non-operating WS server");
      return;
    }
    this.clients.forEach((connection, id) => {
      if (ignore.includes(id)) return;
      connection.message(payload);
    });
  };
}
