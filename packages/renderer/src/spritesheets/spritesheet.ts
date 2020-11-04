export class Spritesheet {
  url: string;
  image?: HTMLImageElement;

  loaded = false;
  sprites: ImageBitmap[] = [];

  private tileHeight: number;
  private tileWidth: number;
  private loadedPromise: Promise<boolean>;

  constructor(url: string, tileWidth: number, tileHeight: number) {
    const image = new Image();
    this.loadedPromise = this.loadImage(image);

    this.url = url;
    this.tileHeight = tileHeight;
    this.tileWidth = tileWidth;

    this.image = image;
    image.src = url;
  }

  isReady = (): Promise<boolean> => this.loadedPromise;

  loadImage = (image: HTMLImageElement): Promise<boolean> =>
    new Promise((resolve) => {
      console.log("Creating image");
      image.onload = async () => {
        console.log("Image loaded!");
        this.loaded = await this.onImageLoad();
        console.log(`Spritesheet (${this.url}) loaded!`);
        resolve(this.loaded);
      };
    });

  onImageLoad = (): Promise<boolean> => {
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

    return Promise.all(promises)
      .then(() => true)
      .catch((err) => {
        console.error(
          `There was an error loading the spritesheet: ${this.url} with error:`
        );
        console.error(err);
        return false;
      });
  };

  getSpriteAtIndex(i: number): ImageBitmap {
    if (i < 0 || i >= this.sprites.length) {
      throw new Error(`Trying to get invalid sprite!
        Spritesheet: ${this.url}
        Sprite Requested: ${i}
        Spritesheet sprite count: ${this.sprites.length}
      `);
    }
    return this.sprites[i];
  }

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
