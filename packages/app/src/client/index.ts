// import "./css/normalize.css";

import * as Client from "@dungeon-crawler/network/dist/client";

import { GameLoop, initWorldConfig } from "@dungeon-crawler/runtime";
import { TiledHelpers, WebRenderer } from "@dungeon-crawler/renderer";
import { map, tiles } from "./loaders/sandbox";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
};

// @todo: lazy load tilemap
async function getWorld(): Promise<{
  map: TiledHelpers.TiledMap;
  tileset: TiledHelpers.TiledTileset;
}> {
  // const { map, tiles } = (await import("./loaders/sandbox")) as {
  //   map: TiledHelpers.TiledMap;
  //   tiles: TiledHelpers.TiledTileset;
  // };
  // return map;
  return Promise.resolve({ map, tileset: tiles });
}

function main() {
  Client.connect("ws://127.0.0.1:3000/socket");
  GameLoop.registerPostUpdateHandler("renderer", WebRenderer.create());
  GameLoop.start(() => {
    void getWorld().then(({ map }) => {
      const world = initWorldConfig(map);
      console.log(world);
      return;
    });
  });
}

main();
