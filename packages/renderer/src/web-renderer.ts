import { Drawable, DrawableOpts, renderDrawable } from "./drawables";
import {
  EditableCanvas,
  createCanvas,
  editCanvas,
  resizeCanvas,
} from "./canvas";

import { Vector2 } from "@dungeon-crawler/core";

// import { TiledMap, TiledTileset } from "../../runtime/src/utils/types";
// import { initWorldConfig, loadTileset } from "./tiled-helpers";

const drawables: Drawable<DrawableOpts>[] = [];

let activeCanvas: HTMLCanvasElement;
let editableCanvas: EditableCanvas;
let pixelsPerCoordinate = new Vector2(32, 16);
let isPaused = false;

let forceDraw = () => {};

export const pause = (): void => {
  isPaused = true;
};

export const unpause = (): void => {
  isPaused = false;
};

const blurHandler = () => {
  pause();
};

const focusHandler = () => {
  unpause();
};

const resizeHandler = () => {
  if (activeCanvas) {
    resizeCanvas(activeCanvas, window.innerWidth, window.innerHeight);
  }
};

type RenderLoop = (timestamp: number | undefined) => void;
const renderLoop: RenderLoop = (): void => {
  if (isPaused) return;
  editableCanvas.clearAll();
  const loopDrawables = drawables.splice(0);
  for (let i = 0; i < loopDrawables.length; i++) {
    renderDrawable(loopDrawables[i], editableCanvas);
  }
  forceDraw();
};

export const create = (): RenderLoop => {
  // Reset queue
  drawables.splice(0);

  // Create canvas/renderer
  activeCanvas = createCanvas();
  editableCanvas = editCanvas(activeCanvas, pixelsPerCoordinate);
  window.addEventListener("resize", resizeHandler);
  window.addEventListener("blur", blurHandler);
  window.addEventListener("focus", focusHandler);
  document.body.append(activeCanvas);

  return renderLoop;
};

export const render = <T extends DrawableOpts>(drawable: Drawable<T>): void => {
  drawables.push(drawable);
};

export const setCoordsSize = (size: Vector2): void => {
  pixelsPerCoordinate = size;
};

export const setForceDraw = (fn: () => void): void => {
  console.log("force draw");
  forceDraw = fn;
};

export const getActiveCanvas = (): HTMLCanvasElement => activeCanvas;

export const renderInterface = {
  pause,
  unpause,
  setCoordsSize,
  render,
};
