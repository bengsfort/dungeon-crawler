import { Entity } from "../entities";
import { Vector2 } from "@dungeon-crawler/core";

export class HumanPlayer extends Entity {
  constructor(position = new Vector2(0, 0)) {
    super(position);
  }
}
