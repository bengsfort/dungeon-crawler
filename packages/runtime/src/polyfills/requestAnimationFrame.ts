import { now } from "@dungeon-crawler/core";

type RafCallback = (timestamp: number) => void;
type RafItem = {
  handle: number;
  cancelled: boolean;
  callback: RafCallback;
};

const FRAME_DURATION = 1000 / 144;
const QUEUE: RafItem[] = [];

let id = 0;
let last = 0;

export const raf = (cb: RafCallback): number => {
  if (window && window.requestAnimationFrame)
    return window.requestAnimationFrame(cb);

  if (QUEUE.length === 0) {
    const frame = now();
    const next = Math.max(0, FRAME_DURATION - (frame - last));
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

export const caf = (id: number): void => {
  if (window && window.cancelAnimationFrame) window.cancelAnimationFrame(id);
  for (let i = 0; i < QUEUE.length; i++) {
    if (QUEUE[i].handle === id) QUEUE[i].cancelled = true;
  }
};
