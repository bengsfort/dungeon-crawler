// import "./css/normalize.css";

import { TiledHelpers, WebRenderer } from "@dungeon-crawler/renderer";

import { GameLoop } from "@dungeon-crawler/runtime";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
};

async function getWorld(): Promise<TiledHelpers.TiledMap> {
  const { map, tiles } = (await import("./loaders/sandbox")) as {
    map: TiledHelpers.TiledMap;
    tiles: TiledHelpers.TiledTileset;
  };
  return map;
}

function main() {
  void getWorld().then((map) => void WebRenderer.loadWorld(map));
  GameLoop.registerPostUpdateHandler("renderer", WebRenderer.create());
  GameLoop.start(() => {});
}

main();
