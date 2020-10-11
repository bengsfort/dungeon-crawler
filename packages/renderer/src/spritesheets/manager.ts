import { Spritesheet } from "./spritesheet";

const dictionary = new Map<string, Spritesheet>();

export const loadSpritesheet = (
  url: string,
  tWidth: number,
  tHeight: number
): Spritesheet => {
  if (dictionary.has(url)) {
    return dictionary.get(url) as Spritesheet;
  }

  const sheet = new Spritesheet(url, tWidth, tHeight);
  dictionary.set(url, sheet);
  return sheet;
};

export const unloadSpritesheet = (url: string): void => {
  const sheet = dictionary.get(url);
  dictionary.delete(url);
  sheet?.unload();
};

export const getSpritesheet = (url: string): Spritesheet | undefined => {
  return dictionary.get(url);
};
