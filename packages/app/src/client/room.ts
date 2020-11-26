// import "./css/normalize.css";

import * as Client from "@dungeon-crawler/network/dist/client";

import { Controls, keyDown } from "./utils/key-down";
import { GameLoop, Runtime, Time, World } from "@dungeon-crawler/runtime";

import { Sandbox } from "@dungeon-crawler/world-configs";
import { WebRenderer } from "@dungeon-crawler/renderer";
import { devTiles } from "./tilesets";

const cancelButton = document.getElementById("cancel") as HTMLButtonElement;
cancelButton.onclick = () => {
  GameLoop.stop();
  // main();
  // setTimeout(() => GameLoop.stop(), 10 * 1000);
};

let debugCanvas: HTMLCanvasElement;
let debugContext: CanvasRenderingContext2D;

const drawFps = () => {
  debugContext.save();
  debugContext.textAlign = "left";
  debugContext.fillStyle = "#ffffff";
  debugContext.font = "16px monospace";
  debugContext.fillText(
    `Current FPS: ${Time.getCurrentFps().toFixed(2)}`,
    16,
    48
  );
  debugContext.restore();
};

function main() {
  Client.connect(`ws://127.0.0.1:3001/play/${ENV_CONFIG.roomId}`);
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
  // just for temp debugging
  debugCanvas = WebRenderer.getActiveCanvas();
  debugContext = debugCanvas.getContext("2d") as CanvasRenderingContext2D;

  // Draws FPS in top right
  WebRenderer.setForceDraw(drawFps);

  GameLoop.start(() => {
    const world = new World(Sandbox.map);
    console.log("World loaded:", world);
  });
}

main();
