import { MessageTypes } from "./MessageTypes";

export interface NetworkMessage {
  type: MessageTypes;
  localTime: number;
}

export class NetworkMessageBase implements NetworkMessage {
  type: MessageTypes;
  localTime: number;

  constructor(type: MessageTypes, localTime: number) {
    this.type = type;
    this.localTime = localTime;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
