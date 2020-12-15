import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ServerStateUpdateMessage<T> extends NetworkMessageBase {
  state: Partial<T>;

  constructor(state: T, localTime = 0) {
    super(MessageTypes.ServerStateUpdate, localTime);
    this.state = state;
  }
}
