import { Drawable, DrawableOpts, DrawableType } from "./types";

import { EditableCanvas } from "../canvas";
import { Vector2 } from "@dungeon-crawler/core";

// Drawable registration/binding:
// Entity uses exposed function to register a drawable
// Registers using options object that allows for easy configuration
// (?) Entity passes a reference to itself for data data binding (so the renderer can render it at the entity position)
// (?) Registers itself with the main renderer
// (?) Main renderer fires off everything

// Example rect opts:
// height, width, color, border?, opacity?

// Example sprite opts:
// height, width, source, opacity?, anchor?

let idCounter = 0;

export interface RectOpts extends DrawableOpts {
  height: number;
  width: number;
  color: string;
  scale: Vector2;
  position: Vector2;
  origin?: Vector2;
  DEBUG_showOrigin?: boolean;
}

export interface RectAttrs extends RectOpts {
  id: string;
  origin: Vector2;
  position: Vector2;
}

const DEFAULT_OPTS = {
  scale: new Vector2(1, 1),
  origin: new Vector2(0, 0),
  position: new Vector2(0, 0),
};

export const createRect = (opts: RectOpts): Drawable<RectAttrs> => {
  const id = `drawable::rect:${++idCounter}`;
  const {
    height,
    width,
    color,
    scale = DEFAULT_OPTS.scale,
    origin = DEFAULT_OPTS.origin,
    position = DEFAULT_OPTS.position,
    DEBUG_showOrigin,
  } = opts;

  const data: RectAttrs = {
    id,
    height,
    width,
    origin,
    color,
    scale,
    position,
    DEBUG_showOrigin,
  };

  return {
    type: DrawableType.Rect,
    data,
  };
};

export const drawRect = (
  renderable: Drawable<RectAttrs>,
  canvas: EditableCanvas
): void => {
  const {
    width,
    height,
    color,
    scale,
    origin,
    position,
    DEBUG_showOrigin,
  } = renderable.data;
  const ctx = canvas.getContext();
  ctx.fillStyle = color;
  const originX = origin.x * width;
  const originY = origin.y * height;
  const pos = canvas.toScreen(position.x, position.y);
  ctx.fillRect(
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
