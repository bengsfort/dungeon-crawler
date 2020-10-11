import { Sprite } from "./sprites";

// client/renderer/canvas.ts
// This module is responsible for utility functions related to creating,
// managing, and interacting with a 2D canvas.

/**
 * Resizes the canvas based on the width + pixel ratio of the device.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  const { devicePixelRatio } = window;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.fillRect(0, 0, width, height);
  console.log("Does this actually work?!");
}

/**
 * Adds an event handler for wiundow resize events that resizes the given canvas to full screen.
 * Returns a function for unsubscribing from window resize events.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Function} Unsubscribe function.
 */
export function resizeCanvasOnWindowResize(
  canvas: HTMLCanvasElement
): () => void {
  const handler = () =>
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}

/**
 * Creates a fullscreen canvas and returns it.
 * @returns {HTMLCanvasElement}
 */
export function createCanvas(): HTMLCanvasElement {
  const { innerWidth, innerHeight } = window;
  const canvas = document.createElement("canvas");
  resizeCanvas(canvas, innerWidth, innerHeight);
  console.log("Canvas created.");
  return canvas;
}

export interface EditableCanvas {
  getContext(): CanvasRenderingContext2D;
  drawSprite(
    sprite: Sprite,
    x: number,
    y: number,
    scale?: number
  ): EditableCanvas;
  clear(width: number, height: number, x?: number, y?: number): EditableCanvas;
  clearAll(): EditableCanvas;
}
export function editCanvas(canvas: HTMLCanvasElement): EditableCanvas {
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  return {
    getContext() {
      return context;
    },
    drawSprite(sprite: Sprite, x: number, y: number, scale = 1) {
      context.drawImage(
        sprite.data,
        x,
        y,
        sprite.width * scale,
        sprite.height * scale
      );
      return this;
    },
    clear(width: number, height: number, x = 0, y = 0) {
      context.clearRect(x, y, width, height);
      return this;
    },
    clearAll() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return this;
    },
  };
}
