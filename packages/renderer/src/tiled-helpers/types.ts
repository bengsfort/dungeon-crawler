import { CustomObject, TiledCustomObjectTypes } from "./object-types";

export enum TiledRenderOrder {
  RightDown = "right-down",
  RightUp = "right-up",
  LeftDown = "left-down",
  LeftUp = "left-up",
}

export enum TiledOrientation {
  Orthogonal = "orthogonal",
  Isometric = "isometric",
}

export enum TiledLayerType {
  Tile = "tilelayer",
  Object = "objectgroup",
}

export type TiledEditorSettings = {
  export: {
    format: "json";
    target: string;
  };
};

export type TiledMapLayer = {
  data: number[];
  height: number;
  width: number;
  id: number;
  name: string;
  opacity: number;
  type: TiledLayerType;
  visible: boolean;
  x: number;
  y: number;
};

export type TiledObject = {
  height: number;
  width: number;
  id: number;
  name: string;
  point: boolean;
  rotation: number;
  visible: boolean;
  x: number;
  y: number;
  type: TiledCustomObjectTypes;
  properties: CustomObject[];
};

export type TiledObjectLayer = TiledMapLayer & {
  draworder: "topdown" | "manual";
  objects: TiledObject[];
};

export type TiledMap = {
  compressionlevel: number;
  editorsettings: TiledEditorSettings;
  height: number;
  width: number;
  tileheight: number;
  tilewidth: number;
  infinite: boolean;
  nextlayerid: number;
  nextobjectid: number;
  orientation: TiledOrientation;
  renderorder: TiledRenderOrder;
  tiledversion: string;
  type: "map";
  version: number;
  layers: TiledMapLayer[];
};

export type TiledTileset = {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: "tileset";
  version: number;
};
