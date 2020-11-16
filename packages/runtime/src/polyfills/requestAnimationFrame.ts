import { now } from "@dungeon-crawler/core";

type RafCallback = (timestamp: number) => void;
type RafItem = {
  handle: number;
  cancelled: boolean;
  callback: RafCallback;
};

const QUEUE: RafItem[] = [];

let id = 0;
let last = 0;

const requestFixedTick = (cb: RafCallback, fps = 60): number => {
  if (QUEUE.length === 0) {
    const frame = now();
    const next = Math.max(0, 1000 / fps - (frame - last));
    last = frame + next;

    setTimeout(() => {
      const stack = QUEUE.slice(0);
      QUEUE.length = 0;
      for (let i = 0; i < stack.length; i++) {
        if (!stack[i].cancelled) {
          stack[i].callback(last);
        }
      }
    }, next);
  }

  QUEUE.push({
    handle: ++id,
    cancelled: false,
    callback: cb,
  });
  return id;
};

export const raf = (cb: RafCallback, fps = -1): number => {
  if (fps < 0 && typeof window !== "undefined" && window.requestAnimationFrame)
    return window.requestAnimationFrame(cb);
  return requestFixedTick(cb, fps);
};

export const caf = (id: number): void => {
  if (window && window.cancelAnimationFrame) window.cancelAnimationFrame(id);
  for (let i = 0; i < QUEUE.length; i++) {
    if (QUEUE[i].handle === id) QUEUE[i].cancelled = true;
  }
};
