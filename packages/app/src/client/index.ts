// import "./css/normalize.css";

import * as Client from "@dungeon-crawler/network/dist/client";

import { TiledHelpers, WebRenderer } from "@dungeon-crawler/renderer";
import { map, tiles } from "./loaders/sandbox";

import { GameLoop } from "@dungeon-crawler/runtime";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
};

async function getWorld(): Promise<TiledHelpers.TiledMap> {
  // const { map, tiles } = (await import("./loaders/sandbox")) as {
  //   map: TiledHelpers.TiledMap;
  //   tiles: TiledHelpers.TiledTileset;
  // };
  // return map;
  return Promise.resolve(map);
}

function main() {
  Client.connect("ws://127.0.0.1:3000/socket");
  void getWorld().then((map) => void WebRenderer.loadWorld(map));
  GameLoop.registerPostUpdateHandler("renderer", WebRenderer.create());
  GameLoop.start(() => {});
}

main();
