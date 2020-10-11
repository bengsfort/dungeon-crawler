import { Vector2 } from "./vector2";

export interface Entity {
  readonly id: string;
  position: Vector2;
}
