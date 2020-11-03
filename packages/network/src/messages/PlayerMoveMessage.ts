import { MessageTypes } from "./MessageTypes";
import { NetworkMessageBase } from "./NetworkMessage";
import { Vector2 } from "@dungeon-crawler/core";

export class PlayerMoveMessage extends NetworkMessageBase {
  clientId: string;
  position: Vector2;

  constructor(id: string, pos: Vector2, localTime: number) {
    super(MessageTypes.ClientConnected, localTime);
    this.clientId = id;
    this.position = pos.copy();
  }
}
