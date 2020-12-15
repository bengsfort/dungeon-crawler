import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ClientAcknowledgementMessage extends NetworkMessageBase {
  tick: number;

  constructor(tick: number, localTime = 0) {
    super(MessageTypes.ClientAcknowledgement, localTime);
    this.tick = tick;
  }
}
