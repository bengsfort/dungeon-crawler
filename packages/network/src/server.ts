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
import { Request } from "express";
import expressWs from "express-ws";

interface SignedCookies {
  GameSessionAuth: string;
}

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

  constructor() {
    this.clients = new Map<string, ClientConnection>();
  }

  clientConnectionHandler: expressWs.WebsocketRequestHandler = (
    ws,
    req: Request
  ) => {
    const id: string = (req.signedCookies as SignedCookies).GameSessionAuth;
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
          `Got acknowledgement from client ${id} for tick ${
            (data as ClientAcknowledgementMessage).tick
          }`
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
    this.clients.forEach((connection, id) => {
      if (ignore.includes(id)) return;
      connection.message(payload);
    });
  };
}
