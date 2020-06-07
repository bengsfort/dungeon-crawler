interface Vector2 {
  x: number;
  y: number;
  copy(): Vector2;
  multiply(val: number): void;
}

export function makeVector2(x: number, y: number): Vector2 {
  let currX = x;
  let currY = y;

  const instance = {
    copy() {
      return makeVector2(currX, currY);
    },
    multiply(val: number) {
      currX *= val;
      currY *= val;
    },
  };

  Object.defineProperty(instance, "x", {
    get() {
      return currX;
    },
    set(val: number) {
      currX = val;
    },
  });
  Object.defineProperty(instance, "y", {
    get() {
      return currY;
    },
    set(val: number) {
      currY = val;
    },
  });

  return instance as Vector2;
}
