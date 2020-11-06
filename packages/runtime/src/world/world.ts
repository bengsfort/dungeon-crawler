import { Controller } from "../controllers";
import { Transform } from "../transform";
import { Vector2 } from "@dungeon-crawler/core";

export class World {
  transform: Transform;
  controllers: Controller[];
  /**
   * The background to render behind the world.
   */
  background: string;

  constructor(pos = new Vector2(0, 0), scale = new Vector2(1, 1)) {
    this.transform = new Transform(pos, scale);
    this.controllers = [];
    this.background = "#000000";
  }
}
