import { Drawable, Drawables, RectOpts } from "@dungeon-crawler/renderer";

import { BaseController } from "./controller";
import { Renderer } from "../interop-interfaces";
import { Vector2 } from "@dungeon-crawler/core";
import { getRenderer } from "../runtime";

interface Opts {
  width: number;
  height: number;
  color: string;
  origin?: Vector2;
}

export class RectController extends BaseController {
  private _drawable: Drawable<RectOpts>;
  private _renderer: Renderer;

  constructor({ width, height, color, origin }: Opts) {
    super();
    this._drawable = Drawables.createRect({
      width,
      height,
      color,
      origin,
      scale: Vector2.One,
      position: Vector2.Zero,
      DEBUG_showOrigin: true,
    });
    this._renderer = getRenderer();
  }

  tick = (): void => {
    const { _drawable, entity } = this;
    _drawable.data.scale = entity.transform.scale;
    _drawable.data.position = entity.transform.position;
    this._renderer.render(_drawable);
  };
}
