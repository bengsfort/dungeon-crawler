import { Drawable, DrawableOpts, DrawableType } from "./types";
import { RectAttrs, drawRect } from "./rect";

import { EditableCanvas } from "../canvas";

export const renderDrawable = (
  drawable: Drawable<DrawableOpts>,
  canvas: EditableCanvas
): void => {
  switch (drawable.type) {
    case DrawableType.Rect:
    default:
      drawRect(drawable as Drawable<RectAttrs>, canvas);
  }
};
