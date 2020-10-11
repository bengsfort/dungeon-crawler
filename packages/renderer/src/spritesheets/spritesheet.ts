export class Spritesheet {
  url: string;
  image?: HTMLImageElement;

  loaded = false;
  sprites: ImageBitmap[] = [];

  private tileHeight: number;
  private tileWidth: number;

  constructor(url: string, tileWidth: number, tileHeight: number) {
    const image = new Image();
    image.onload = this.onImageLoad;

    this.url = url;
    this.tileHeight = tileHeight;
    this.tileWidth = tileWidth;

    this.image = image;
    image.src = url;
  }

  onImageLoad = (): void => {
    const { image, tileHeight, tileWidth } = this;
    const { width, height } = image as HTMLImageElement;
    const widthCount = width / tileWidth;
    const heightCount = height / tileHeight;
    const promises = [];

    for (let y = 0; y < heightCount; y++) {
      for (let x = 0; x < widthCount; x++) {
        promises.push(
          createImageBitmap(
            image as HTMLImageElement,
            x * tileWidth,
            y * tileHeight,
            tileWidth,
            tileHeight
          ).then((sprite) => (this.sprites[x + y * widthCount] = sprite))
        );
      }
    }

    Promise.all(promises)
      .then(() => (this.loaded = true))
      .catch((err) => {
        console.error(
          `There was an error loading the spritesheet: ${this.url} with error:`
        );
        console.error(err);
      });
  };

  getSprite(x: number, y: number): ImageBitmap {
    const widthCount = (this.image as HTMLImageElement).width / this.tileWidth;
    return this.sprites[x + y * widthCount];
  }

  unload(): void {
    this.loaded = false;
    this.sprites = [];
    this.image?.remove();
  }
}
