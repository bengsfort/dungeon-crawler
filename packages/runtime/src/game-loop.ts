import { caf, raf } from "./polyfills";

const NOOP = () => {};

// Internal game loop state
let rafId = 0;
let id = 0;
const updateHandlers = new Map<number, (timestamp: number) => void>();
const postUpdateHandlers = new Map<number, (timestamp: number) => void>();

function update(timestamp = 0): void {
  rafId = raf(update);

  // Update handlers are what most things will use for their update loop.
  updateHandlers.forEach((handler) => handler(timestamp));
  // Post update handlers are meant for things like rendering, that happen
  // after entity/controller state has already been updated.
  postUpdateHandlers.forEach((handler) => handler(timestamp));
}

export const start = (setup = NOOP): void => {
  console.log("Starting game loop.");
  setup();
  update();
};

export const stop = (): void => {
  caf(rafId);
  console.log("Stopping game loop.");
};

export const registerUpdateHandler = (
  handler: (timestamp?: number) => void
): number => {
  const handlerId = ++id;
  updateHandlers.set(handlerId, handler);
  return handlerId;
};

export const removeUpdateHandler = (id: number): boolean => {
  if (updateHandlers.has(id)) {
    updateHandlers.delete(id);
    return true;
  }
  return false;
};

export const registerPostUpdateHandler = (
  handler: (timestamp?: number) => void
): number => {
  const handlerId = ++id;
  updateHandlers.set(handlerId, handler);
  return handlerId;
};

export const removePostUpdateHandler = (id: number): boolean => {
  if (postUpdateHandlers.has(id)) {
    postUpdateHandlers.delete(id);
    return true;
  }
  return false;
};
