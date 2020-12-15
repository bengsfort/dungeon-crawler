import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ClientConnectedMessage extends NetworkMessageBase {
  clientId: string;

  constructor(id: string, localTime = 0) {
    super(MessageTypes.ClientConnected, localTime);
    this.clientId = id;
  }
}
