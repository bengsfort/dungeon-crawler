import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ClientConnectedMessage extends NetworkMessageBase {
  clientId: string;

  constructor(id: string, localTime: number) {
    super(MessageTypes.ClientConnected, localTime);
    this.clientId = id;
  }
}
