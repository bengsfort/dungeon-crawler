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

let connection: WebSocket;
const queue = [];

const onWsConnected = (event: Event) => {
  console.log("WebSocket is connecting...");
};
const onWsError = (event: Event) => {
  console.error("WebSocket error:", event);
};
const onWsClose = (event: Event) => {
  console.log("WebSocket connection closed.", event);
};

const onMessage = (event: MessageEvent): void => {
  // @todo: implement
  // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
  // this is just for testing purposes, properly handle...
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

export const connect = (host: string): boolean => {
  console.log("Creating socket...");
  connection = new WebSocket(host);
  connection.onopen = onWsConnected;
  connection.onerror = onWsError;
  connection.onclose = onWsClose;
  connection.onmessage = onMessage;
  return true;
};

export const disconnect = (): boolean => {
  // @todo: implement
  return true;
};

export const isConnected = (): boolean => {
  return connection && connection.readyState === WSReadyState.Connected;
};

export const sendMessage = <T>(
  messageType: MessageTypes,
  payload?: T
): boolean => {
  if (isConnected()) {
    // @todo: Use ArrayBuffer or TypedArray here?
    connection.send(
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
