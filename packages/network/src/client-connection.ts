import { ConnectionHandshakeMessage, NetworkMessageBase } from "./messages";

import { NOOP } from "./common";
import WebSocket from "ws";
import { now } from "@dungeon-crawler/core";
import { v4 as uuidv4 } from "uuid";

export type OnCloseEventHandler = (id: string) => void;
export type OnMessageEventHandler = (
  id: string,
  data: NetworkMessageBase
) => void;

export class ClientConnection {
  readonly id: string;
  readonly connectTime: number;

  onClose: OnCloseEventHandler = NOOP;
  onMessage: OnMessageEventHandler = NOOP;

  get Ready(): boolean {
    return this._open;
  }

  private _ws: WebSocket;
  private _open = false;
  private _queue: string[] = [];

  constructor(ws: WebSocket, id?: string) {
    this.id = id || uuidv4();
    this.connectTime = now();

    ws.onopen = this._onOpen;
    ws.onclose = this._onClose;
    ws.onmessage = this._onMessage;
    ws.onerror = this._onError;

    const handshake = new ConnectionHandshakeMessage(
      this.id,
      true,
      this.connectTime
    );
    ws.send(handshake.toString());

    this._ws = ws;
  }

  _onOpen = (): void => {
    this._open = true;
    console.log("[Networking] New client connected (", this.id, ").");
    while (this._queue.length > 0) {
      const payload = this._queue.shift();
      this._ws.send(payload);
    }
  };

  _onClose = (ev: WebSocket.CloseEvent): void => {
    this._open = false;
    console.log(
      `[Networking] Client ${this.id} closed: ${ev.reason} (code: ${ev.code})`
    );
    this.onClose(this.id);
  };

  _onMessage = (ev: WebSocket.MessageEvent): void => {
    this.onMessage(this.id, JSON.parse(ev.data.toString()));
  };

  _onError = (ev: WebSocket.ErrorEvent): void => {
    console.error(
      `[Networking] Client ${this.id} errored:`,
      ev.error,
      ev.message
    );
  };

  message = <T extends NetworkMessageBase>(payload: T): void => {
    if (this._open === false) {
      console.log(
        `[Networking] Trying to send a message to unopened client (${this.id})`
      );
      this._queue.push(payload.toString());
      return;
    }

    this._ws.send(payload.toString());
  };
}
