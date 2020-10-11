import { caf, raf } from "./polyfills";

import { ActorDirectory } from "./actors";

const NOOP = () => {};

// Internal game loop state
let rafId = 0;
const updateHandlers = new Map<string, (timestamp?: number) => void>();
const postUpdateHandlers = new Map<string, (timestamp?: number) => void>();

function update(timestamp = 0): void {
  rafId = raf(update);

  // Update handlers are what most things will use for their update loop.
  updateHandlers.forEach((handler) => handler(timestamp));
  // Post update handlers are meant for things like rendering, that happen
  // after entity/controller state has already been updated.
  postUpdateHandlers.forEach((handler) => handler(timestamp));
}

export const start = (setup = NOOP): void => {
  ActorDirectory.flush();
  setup();
  update();
};

export const stop = (): void => {
  caf(rafId);
};

export const registerUpdateHandler = (
  id: string,
  handler: (timestamp?: number) => void
): void => {
  if (!updateHandlers.has(id)) {
    updateHandlers.set(id, handler);
  }
};

export const removeUpdateHandler = (id: string): void => {
  if (updateHandlers.has(id)) {
    updateHandlers.delete(id);
  }
};

export const registerPostUpdateHandler = (
  id: string,
  handler: (timestamp?: number) => void
): void => {
  if (!postUpdateHandlers.has(id)) {
    updateHandlers.set(id, handler);
  }
};

export const removePostUpdateHandler = (id: string): void => {
  if (postUpdateHandlers.has(id)) {
    postUpdateHandlers.delete(id);
  }
};
