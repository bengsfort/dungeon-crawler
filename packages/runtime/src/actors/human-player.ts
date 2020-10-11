import { Actor } from "./actor";
import { Vector2 } from "@dungeon-crawler/core";

let idCounter = 0;

export class HumanPlayer extends Actor {
  public readonly id = `actor::player::human::${++idCounter}`;

  constructor(position = new Vector2(0, 0)) {
    super(position);
  }
}
