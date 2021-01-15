// Client interface for connecting to the dungeon crawler server

import {
  ClientConnectedMessage,
  ClientDisconnectedMessage,
  ConnectionHandshakeMessage,
  MessageTypes,
  NetworkMessageBase,
  ServerStateUpdateMessage,
} from "./messages";
import { NOOP, WSReadyState } from "./common";

// @todo: think about how client and server pull and integrate events in main loops
// (try to synchronize 'update' ticks so physics events happen on a fixed timer)
export type OnConnectionAcceptedHandler = (
  msg: ConnectionHandshakeMessage
) => void;
export type OnServerStateUpdateHandler = <T>(
  msg: ServerStateUpdateMessage<T>
) => void;

export class WsClient {
  onConnectionApproved: OnConnectionAcceptedHandler = NOOP;
  onServerStateUpdate: OnServerStateUpdateHandler = NOOP;

  _connection: WebSocket;

  get isConnected(): boolean {
    return this._connection?.readyState === WSReadyState.Open;
  }

  constructor(host: string) {
    const connection = new WebSocket(host);
    connection.onopen = this._onWsConnected;
    connection.onerror = this._onWsError;
    connection.onclose = this._onWsClose;
    connection.onmessage = this._onMessage;
    this._connection = connection;
  }

  disconnect = (): void => {
    // @todo: implement
  };

  _onWsConnected = (event: Event): void => {
    console.log("WebSocket is connecting...");
  };

  _onWsError = (event: Event): void => {
    console.error("WebSocket error:", event);
  };

  _onWsClose = (event: Event): void => {
    console.log("WebSocket connection closed.");
  };

  _onMessage = (event: MessageEvent): void => {
    const data: NetworkMessageBase = JSON.parse(event.data);
    switch (data.type) {
      case MessageTypes.ClientConnected:
        console.log(
          "Another client connected:",
          (data as ClientConnectedMessage).clientId
        );
        break;
      case MessageTypes.ClientDisconnected:
        console.log(
          "Another client disconnected",
          (data as ClientDisconnectedMessage).clientId
        );
        break;
      case MessageTypes.ConnectionHandshake:
        console.log("Server handshake received.");
        this.onConnectionApproved(data as ConnectionHandshakeMessage);
        break;
      case MessageTypes.ServerStateUpdate:
        console.log("Recieved server STATE UPDATE");
        this.onServerStateUpdate(data as ServerStateUpdateMessage<unknown>);
    }
  };

  sendMessage = <T extends NetworkMessageBase>(payload: T): boolean => {
    if (this.isConnected === true) {
      // @todo: Use ArrayBuffer or TypedArray here?
      this._connection.send(payload.toString());
      return true;
    } else {
      console.error(
        `Tried to send ${payload.type} message to disconnected server!`
      );
      return false;
    }
  };
}
