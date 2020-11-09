import {
  Drawable,
  DrawableOpts,
} from "@dungeon-crawler/renderer/dist/drawables";

import { Vector2 } from "@dungeon-crawler/core";

export interface Renderer {
  pause(): void;
  unpause(): void;
  setCoordsSize(size: Vector2): void;
  render<T extends DrawableOpts>(drawable: Drawable<T>): void;
}

export interface InputSource {
  forward(): boolean;
  backwards(): boolean;
  left(): boolean;
  right(): boolean;
  space(): boolean; // temp
  control(): boolean; // temp
}
