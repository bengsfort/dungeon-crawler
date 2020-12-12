import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ClientInfoUpdatedMessage extends NetworkMessageBase {
  displayName: string;
  playerClass: string;

  constructor(name: string, playerClass: string, localTime: number) {
    super(MessageTypes.ClientInfoUpdated, localTime);
    this.displayName = name;
    this.playerClass = playerClass;
  }
}
