import { RectController, TestMovementController } from "../controllers";
import {
  TiledLayerType,
  TiledMap,
  TiledMapLayer,
  TiledRenderOrder,
} from "./types";

import { Entity } from "../entities";
import { Vector2 } from "@dungeon-crawler/core";
import { World } from "../world";
import { getRenderer } from "../runtime";

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
      return height - Math.floor(index / width);
    case TiledRenderOrder.LeftDown:
    case TiledRenderOrder.RightDown:
    default:
      return Math.floor(index / width);
  }
};

const layerInitializer = (
  layer: TiledMapLayer,
  map: TiledMap
): Entity | undefined => {
  if (!layer?.data || layer?.type === TiledLayerType.Object) {
    return;
  }
  const layerEntity = new Entity(
    new Vector2(layer.x, layer.y),
    new Vector2(1, 1),
    `${map.editorsettings.export.target}::${layer.name}`
  );
  let x = 0;
  let y = 0;
  for (let i = 0; i < layer.data.length; i++) {
    if (layer.data[i] === 0) {
      // tiled map '0' means 'empty'
      continue;
    }
    x = getTileX(i, layer, map.renderorder as TiledRenderOrder);
    y = getTileY(i, layer, map.renderorder as TiledRenderOrder);
    const entity = new Entity(new Vector2(x, y));
    entity.addController(
      new RectController({
        width: map.tilewidth,
        height: map.tileheight,
        color: "#ababab",
      })
    );
    layerEntity.addChild(entity);
  }
  return layerEntity;
};

// @todo: Move this into the World class, have it manage itself
export const initWorldConfig = (map: TiledMap): World => {
  const renderer = getRenderer();
  if (renderer) {
    renderer.setCoordsSize(map.tilewidth);
  }
  const world = new World(
    new Vector2(0, 0),
    new Vector2(1, 1),
    map.editorsettings.export.target
  );
  // @todo: Better API for controllers, this blows
  world.addController(
    new RectController({
      width: map.tilewidth * map.width,
      height: map.tileheight * map.height,
      color: "#a475b7",
    })
  );
  world.addController(new TestMovementController({ speed: 2 }));
  let layer;
  for (let i = 0; i < map.layers.length; i++) {
    layer = layerInitializer(map.layers[i], map);
    if (layer) {
      world.addChild(layer);
    }
  }
  return world;
};
