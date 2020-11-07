import { Entity } from "../entities";
import { Vector2 } from "@dungeon-crawler/core";

export class World extends Entity {
  background: string;

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1), name = "") {
    super(pos, scale, name);
    this.background = "#000000";
  }
}
