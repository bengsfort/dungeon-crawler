import { Vector2 } from "@dungeon-crawler/core";

export enum DrawableType {
  Rect,
  Sprite,
}

export interface DrawableOpts {
  position: Vector2;
}

export interface Drawable<T extends DrawableOpts> {
  type: DrawableType;
  data: T;
}
