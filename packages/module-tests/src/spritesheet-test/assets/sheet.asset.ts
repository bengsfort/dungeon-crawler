// import { Sprite, createSprite, loadImage } from "@dungeon-crawler/renderer";
import { Sprite, createSprite, loadImage } from "@dungeon-crawler/renderer";

// @ts-ignore
import sheet from "./sheet.png";

const SPRITE_SIZE = 16;

function getOffset(val: number): number {
  return SPRITE_SIZE * val;
}

// @todo: It sucks this is manual, buuuuut.... /shrug
export async function loader(): Promise<Sprite[]> {
  const image = await loadImage(sheet);

  // Helper function for creating a lot of fucking tiles easier
  function createTile(name: string, x = 0, y = 0): Promise<Sprite> {
    return createSprite(
      name,
      image,
      SPRITE_SIZE,
      SPRITE_SIZE,
      getOffset(x),
      getOffset(y)
    );
  }

  return await Promise.all([
    createTile("test_corner_tl", 0, 0),
    createTile("test_edge_t1", 1, 0),
    createTile("test_corner_tr", 5, 0),
  ]);
}
