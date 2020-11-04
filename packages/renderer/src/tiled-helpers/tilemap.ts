import {
  TiledLayerType,
  TiledMap,
  TiledMapLayer,
  TiledOrientation,
  TiledRenderOrder,
} from "./types";

import { DrawableHandler } from "../types";
import { EditableCanvas } from "../canvas";
import { Spritesheet } from "../spritesheets";
import { pauseRenderer } from "../web-renderer";

// @todo: This might need to become a class so you can layer different tile maps.
let ready = false;
let activeMap: TiledMap;
let activeTilesetSheet: Spritesheet;

const getTileX = (
  index: number,
  layer: TiledMapLayer,
  renderOrder: TiledRenderOrder
): number => {
  const width = layer.width || 100;
  switch (renderOrder) {
    case TiledRenderOrder.RightDown:
    case TiledRenderOrder.RightUp:
      return width - (index % width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.LeftUp:
    default:
      return index % width;
  }
};

const getTileY = (
  index: number,
  layer: TiledMapLayer,
  renderOrder: TiledRenderOrder
): number => {
  const width = layer.width || 100;
  const height = layer.height || 100;
  switch (renderOrder) {
    case TiledRenderOrder.LeftUp:
    case TiledRenderOrder.RightUp:
      return height - Math.min(index / width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.RightDown:
    default:
      return Math.min(index / width);
  }
};

const layerDrawHandler = (canvas: EditableCanvas, layerIndex: number) => {
  const context = canvas.getContext();
  const activeLayer = activeMap.layers[layerIndex];
  if (
    !activeLayer?.visible ||
    !activeLayer?.data ||
    activeLayer?.type === TiledLayerType.Object
  ) {
    return;
  }

  let sprite: ImageBitmap;
  let x = 0;
  let y = 0;
  let screenX = 0;
  let screenY = 0;
  for (let i = 0; i < activeLayer.data.length; i++) {
    if (activeLayer.data[i] === 0) {
      // tiled map '0' means 'empty'
      continue;
    }

    sprite = activeTilesetSheet.getSpriteAtIndex(activeLayer.data[i] - 1);
    x = getTileX(i, activeLayer, activeMap.renderorder as TiledRenderOrder);
    y = getTileY(i, activeLayer, activeMap.renderorder as TiledRenderOrder);

    if (
      (activeMap.orientation as TiledOrientation) === TiledOrientation.Isometric
    ) {
      // The offset (canvas width / ratio / 2) is temp, this sort of stuff will be handled
      // by a camera and culling at some point
      screenX =
        (activeMap.tilewidth / 2) * (x - y) +
        context.canvas.width / devicePixelRatio / 2;
      screenY = (activeMap.tileheight / 2) * (x + y);
    } else {
      screenX = activeMap.tilewidth * x;
      screenY = activeMap.tileheight * y;
    }
    canvas.drawSprite(sprite, screenX, screenY);
  }
};

const worldDrawHandler: DrawableHandler = (canvas) => {
  if (!ready || !activeTilesetSheet.loaded) return;
  for (let l = 0; l < activeMap.layers.length; l++) {
    layerDrawHandler(canvas, l);
  }
};

export const initWorldConfig = (
  map: TiledMap,
  tileset: Spritesheet
): DrawableHandler => {
  activeMap = map;
  activeTilesetSheet = tileset;
  ready = true;
  return worldDrawHandler;
};
