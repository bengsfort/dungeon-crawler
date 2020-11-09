import { TiledMapLayer, TiledRenderOrder } from "./types";

export const getTileX = (
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

export const getTileY = (
  index: number,
  layer: TiledMapLayer,
  renderOrder: TiledRenderOrder
): number => {
  const width = layer.width || 100;
  const height = layer.height || 100;
  switch (renderOrder) {
    case TiledRenderOrder.LeftUp:
    case TiledRenderOrder.RightUp:
      return height - Math.floor(index / width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.RightDown:
    default:
      return Math.floor(index / width);
  }
};
