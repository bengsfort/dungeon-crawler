// import "./css/normalize.css";

import * as Client from "@dungeon-crawler/network/dist/client";

import { Controls, keyDown } from "./utils/key-down";
import {
  GameLoop,
  Runtime,
  TiledMap,
  TiledTileset,
  World,
} from "@dungeon-crawler/runtime";
import { map, tiles } from "./loaders/sandbox";

import { WebRenderer } from "@dungeon-crawler/renderer";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
  // main();
  // setTimeout(() => GameLoop.stop(), 10 * 1000);
};

// @todo: lazy load tilemap
async function getWorld(): Promise<{
  map: TiledMap;
  tileset: TiledTileset;
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
  GameLoop.registerPostUpdateHandler(WebRenderer.create());
  Runtime.registerRenderer(WebRenderer.renderInterface);
  Runtime.registerInputManager({
    forward: () => keyDown(Controls.W),
    backwards: () => keyDown(Controls.S),
    left: () => keyDown(Controls.A),
    right: () => keyDown(Controls.D),
    // temp
    space: () => keyDown(Controls.Space),
    control: () => keyDown(Controls.Control),
  });
  GameLoop.start(() => {
    void getWorld().then(({ map }) => {
      const world = new World(map);
      console.log(world);
      return;
    });
  });
}

main();
