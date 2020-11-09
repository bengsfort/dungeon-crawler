import { RectController, TestMovementController } from "../controllers";
import {
  TiledLayerType,
  TiledMap,
  TiledMapLayer,
  TiledRenderOrder,
  getTileX,
  getTileY,
} from "../utils";

import { Entity } from "../entities";
import { Vector2 } from "@dungeon-crawler/core";
import { getRenderer } from "../runtime";

export class World extends Entity {
  background: string;

  constructor(
    map: TiledMap,
    pos = new Vector2(0, 0),
    scale = new Vector2(1, 1)
  ) {
    super(pos, scale, map.editorsettings.export.target);
    this.background = "#000000";
    // Temp for debugging
    this.addController(
      new RectController({
        width: map.tilewidth * map.width,
        height: map.tileheight * map.height,
        color: "#a475",
      })
    );
    this.addController(new TestMovementController({ speed: 2 }));
    this._initMap(map);
  }

  private _initMap(map: TiledMap): void {
    const renderer = getRenderer();
    if (renderer) {
      renderer.setCoordsSize(new Vector2(map.tilewidth, map.tileheight));
    }
    let layer;
    for (let i = 0; i < map.layers.length; i++) {
      layer = this._initLayer(map.layers[i], map);
      if (layer) {
        this.addChild(layer);
      }
    }
  }

  private _initLayer(layer: TiledMapLayer, map: TiledMap): Entity | undefined {
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
        // tiled '0' means 'empty'
        continue;
      }

      x = getTileX(i, layer, map.renderorder as TiledRenderOrder);
      y = getTileY(i, layer, map.renderorder as TiledRenderOrder);
      const tile = new Entity(new Vector2(x, y));
      tile.addController(
        new RectController({
          width: map.tilewidth,
          height: map.tileheight, // is this gonna cause a 2x size on each tile?
          color: "#ababab",
        })
      );
      layerEntity.addChild(tile);
    }
    return layerEntity;
  }
}
