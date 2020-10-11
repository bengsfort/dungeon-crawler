import { Entity, Vector2 } from "@dungeon-crawler/core";

import { EditableCanvas } from "../canvas";
import { registerDrawable } from "../web-renderer";

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

interface RectOpts {
  height: number;
  width: number;
  color: string;
  origin?: Vector2;
}

export interface RectAttrs extends RectOpts {
  id: string;
  origin: Vector2;
}

const DEFAULT_OPTS = {
  origin: new Vector2(0.5, 0.5),
};

export const bindRect = (instance: Entity, opts: RectOpts): RectAttrs => {
  const id = `drawable::rect::${++idCounter}`;
  const { height, width, origin = DEFAULT_OPTS.origin, color } = opts;

  const attrs: RectAttrs = {
    id,
    height,
    width,
    origin,
    color,
  };

  const handler = (canvas: EditableCanvas) => {
    const ctx = canvas.getContext();
    ctx.fillStyle = color;
    const originX = attrs.origin.x * attrs.width;
    const originY = attrs.origin.y * attrs.height;
    ctx.fillRect(
      instance.position.x - originX,
      instance.position.y - originY,
      attrs.width,
      attrs.height
    );
    ctx.fillStyle = "#aeae00";
    ctx.fillRect(instance.position.x - 4, instance.position.y - 4, 8, 8);
  };

  registerDrawable(handler);
  return attrs;
};
