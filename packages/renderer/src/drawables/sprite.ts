import { Drawable, DrawableOpts, DrawableType } from "./types";

import { EditableCanvas } from "../canvas";
import { Vector2 } from "@dungeon-crawler/core";

let idCounter = 0;

// @todo: Add opacity?
export interface SpriteOpts extends DrawableOpts {
  height: number;
  width: number;
  color: string;
  scale: Vector2;
  position: Vector2;
  image: ImageBitmap;
  origin?: Vector2;
  DEBUG_showOrigin?: boolean;
}

export interface SpriteAttrs extends SpriteOpts {
  id: string;
  origin: Vector2;
  position: Vector2;
}

const DEFAULT_OPTS = {
  scale: new Vector2(1, 1),
  origin: new Vector2(0, 0),
  position: new Vector2(0, 0),
};

export const createSprite = (opts: SpriteOpts): Drawable<SpriteAttrs> => {
  const id = `drawable::rect:${++idCounter}`;
  const {
    height,
    width,
    color,
    image,
    scale = DEFAULT_OPTS.scale,
    origin = DEFAULT_OPTS.origin,
    position = DEFAULT_OPTS.position,
    DEBUG_showOrigin,
  } = opts;

  const data: SpriteAttrs = {
    id,
    height,
    width,
    origin,
    color,
    image,
    scale,
    position,
    DEBUG_showOrigin,
  };

  return {
    type: DrawableType.Sprite,
    data,
  };
};

export const drawSprite = (
  renderable: Drawable<SpriteAttrs>,
  canvas: EditableCanvas
): void => {
  const {
    width,
    height,
    color,
    scale,
    image,
    origin,
    position,
    DEBUG_showOrigin,
  } = renderable.data;
  const ctx = canvas.getContext();
  ctx.fillStyle = color;
  const originX = origin.x * width;
  const originY = origin.y * height;
  // @todo: This should be configurable.
  const pos = canvas.toScreenIsometric(
    position.x * scale.x,
    position.y * scale.y
  );
  ctx.drawImage(
    image,
    pos.x - originX,
    pos.y - originY,
    width * scale.x,
    height * scale.y
  );
  if (DEBUG_showOrigin) {
    ctx.fillStyle = "#aeae00";
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
      pos.x - originX,
      pos.y - originY,
      width * scale.x,
      height * scale.y
    );
    ctx.fillRect(pos.x - 4, pos.y - 4, 8, 8);
  }
};
