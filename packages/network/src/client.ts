// Client interface for connecting to the dungeon crawler server

import {
  ClientConnectedMessage,
  ClientDisconnectedMessage,
  ConnectionHandshakeMessage,
  MessageTypes,
  NetworkMessageBase,
} from "./messages";

import { WSReadyState } from "./common";

// @todo: think about how client and server pull and integrate events in main loops
// (try to synchronize 'update' ticks so physics events happen on a fixed timer)

export class WsClient {
  private _connection: WebSocket;

  get isConnected(): boolean {
    return (
      this._connection && this._connection.readyState === WSReadyState.Connected
    );
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
    console.log("WebSocket connection closed.", event);
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
        console.log(
          "Received handshake from server.",
          (data as ConnectionHandshakeMessage).accepted
            ? "Connection accepted, our ID is: " +
                (data as ConnectionHandshakeMessage).clientId
            : "Connection refused."
        );
    }
  };

  sendMessage = <T>(messageType: MessageTypes, payload?: T): boolean => {
    if (this.isConnected === true) {
      // @todo: Use ArrayBuffer or TypedArray here?
      this._connection.send(
        JSON.stringify({
          type: messageType,
          payload,
        })
      );
      return true;
    } else {
      console.error(
        `Tried to send ${messageType} message to disconnected server!`
      );
      return false;
    }
  };
}
