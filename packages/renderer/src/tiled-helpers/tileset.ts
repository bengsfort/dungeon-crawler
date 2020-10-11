import path from "path";
import { TiledTileset } from "./types";

// TODO: TILEMAPS
// TODO: Import tilemap json
// TODO: Import tileset json
// TODO: Import object json
// TODO: Load spritesheet using spritesheet manager
// TODO: Render tilemap using parsed tilemap json
export const importTileset = (uri: string): TiledTileset | undefined => {
  if (path.extname(uri) !== ".json") {
    console.error("Tilesets can only be loaded as json.");
    return;
  }
  const tiledTileset = await import(uri);
};
