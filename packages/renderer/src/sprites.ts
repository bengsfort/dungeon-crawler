export interface Sprite {
  name: string;
  data: ImageBitmap;
  width: number;
  height: number;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function createSprite(
  name: string,
  src: HTMLImageElement,
  width: number,
  height: number,
  x: number,
  y: number
): Promise<Sprite> {
  const data = await createImageBitmap(src, x, y, width, height);
  return {
    name,
    data,
    width,
    height,
  };
}
