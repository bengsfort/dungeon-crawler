import { Drawable, DrawableOpts, DrawableType } from "./types";
import { RectAttrs, drawRect } from "./rect";
import { SpriteAttrs, drawSprite } from "./sprite";

import { EditableCanvas } from "../canvas";

export const renderDrawable = (
  drawable: Drawable<DrawableOpts>,
  canvas: EditableCanvas
): void => {
  switch (drawable.type) {
    case DrawableType.Sprite:
      drawSprite(drawable as Drawable<SpriteAttrs>, canvas);
      break;
    case DrawableType.Rect:
    default:
      drawRect(drawable as Drawable<RectAttrs>, canvas);
  }
};
