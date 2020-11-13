import { caf, raf } from "./polyfills";
import { frameStart, runtimeStart } from "./time";

const NOOP = () => {};

// Internal game loop state
let rafId = 0;
let id = 0;

// Update handlers are what most things will use for their update loop
const updateHandlers = new Map<number, (timestamp: number) => void>();
// Post update handlers are meant for things like rendering, that happen
// after entity/controller state has already been updated.
const postUpdateHandlers = new Map<number, (timestamp: number) => void>();

let useFixedTicks = false;
let fixedTicksPerSecond = 60;

function update(timestamp = 0): void {
  frameStart();
  rafId = raf(update);
  const handlers = [...updateHandlers.values(), ...postUpdateHandlers.values()];
  for (let i = 0; i < handlers.length; i++) {
    handlers[i](timestamp);
  }
}

export const setFixedTickrate = (val: boolean, fps = 60): void => {
  useFixedTicks = val;
  fixedTicksPerSecond = fps;
};

export const start = (setup = NOOP): void => {
  console.log("Starting game loop.");
  runtimeStart();
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
