// import "./css/normalize.css";

import { GameLoop } from "@dungeon-crawler/runtime";
import { WebRenderer } from "@dungeon-crawler/renderer";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
};

function main() {
  GameLoop.registerPostUpdateHandler("renderer", WebRenderer.create());
  GameLoop.start(() => {});
}

main();
