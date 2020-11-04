import {
  EditableCanvas,
  createCanvas,
  editCanvas,
  resizeCanvas,
} from "./canvas";
import { TiledMap, TiledTileset } from "./tiled-helpers/types";
import { initWorldConfig, loadTileset } from "./tiled-helpers";

import { DrawableHandler } from "./types";

let drawableCounter = 0;
const drawables = new Map<number, DrawableHandler>();
let baseWorldDrawHandler: DrawableHandler = () => {};

let activeCanvas: HTMLCanvasElement;
let editableCanvas: EditableCanvas;

let pause = false;

const blurHandler = () => {
  pause = true;
};

const focusHandler = () => {
  pause = false;
};

const resizeHandler = () => {
  if (activeCanvas) {
    resizeCanvas(activeCanvas, window.innerWidth, window.innerHeight);
  }
};

type RenderLoop = (timestamp: number | undefined) => void;
const renderLoop: RenderLoop = (timestamp = 0): void => {
  if (pause) return;
  editableCanvas.clearAll();
  baseWorldDrawHandler(editableCanvas, timestamp);
  drawables.forEach((handler) => handler(editableCanvas, timestamp));
};

export const create = (): RenderLoop => {
  // Reset queue
  drawables.clear();
  drawableCounter = 0;

  // Create canvas/renderer
  activeCanvas = createCanvas();
  editableCanvas = editCanvas(activeCanvas);
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("blur", blurHandler);
  window.addEventListener("focus", focusHandler);
  document.body.append(activeCanvas);

  return renderLoop;
};

export const registerDrawable = (handler: DrawableHandler): number => {
  const id = ++drawableCounter;
  drawables.set(id, handler);
  return id;
};

export const removeDrawable = (id: number): void => {
  if (drawables.has(id)) {
    drawables.delete(id);
  } else {
    console.warn(
      `[WebRenderer] Trying to remove drawable that does not exist (id: ${id})`
    );
  }
};

// This should probably be somewhere else.
export const loadWorld = async (
  tilemap: TiledMap,
  tileset: TiledTileset
): Promise<void> => {
  const spritesheet = loadTileset(tileset);
  await spritesheet.isReady();
  const drawHandler = initWorldConfig(tilemap, spritesheet);
  baseWorldDrawHandler = drawHandler;
};

export const pauseRenderer = (shouldPause: boolean): void => {
  pause = shouldPause;
};
