import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";

export class ClientInputCommandMessage<T> extends NetworkMessageBase {
  tick: number;
  commands: T[];

  constructor(tick: number, commands: T[], localTime = 0) {
    super(MessageTypes.ClientInputCommand, localTime);
    this.commands = commands;
    this.tick = tick;
  }
}
