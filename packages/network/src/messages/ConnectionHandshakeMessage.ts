import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ConnectionHandshakeMessage extends NetworkMessageBase {
  clientId: string;
  accepted: boolean;

  constructor(id: string, accepted: boolean, localTime: number) {
    super(MessageTypes.ConnectionHandshake, localTime);
    this.clientId = id;
    this.accepted = accepted;
  }
}
