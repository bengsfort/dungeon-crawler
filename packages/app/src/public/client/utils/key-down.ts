export enum Controls {
  W = "w",
  A = "a",
  S = "s",
  D = "d",
  Space = " ",
  Control = "Control",
}

const keys = new Map<Controls, boolean>();

// Default everything to false
for (const control in Controls) {
  keys.set(Controls[control as keyof typeof Controls], false);
}

// keyboard event handling
window.onkeydown = ({ key }: KeyboardEvent): void => {
  console.log(key);
  if (keys.has(key as Controls)) {
    keys.set(key as Controls, true);
  }
};

window.onkeyup = ({ key }: KeyboardEvent): void => {
  if (keys.has(key as Controls)) {
    keys.set(key as Controls, false);
  }
};

export function keyDown(key: Controls): boolean {
  return keys.get(key) || false;
}
