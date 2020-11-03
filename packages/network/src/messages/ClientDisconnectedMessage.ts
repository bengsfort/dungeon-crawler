import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

// @todo: Don't think this is really necessary, could just have one connection message with a boolean.
export class ClientDisconnectedMessage extends NetworkMessageBase {
  clientId: string;

  constructor(id: string, localTime: number) {
    super(MessageTypes.ClientDisconnected, localTime);
    this.clientId = id;
  }
}
