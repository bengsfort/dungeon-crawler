import { createCanvas, editCanvas } from "@dungeon-crawler/renderer";

import { loader } from "./assets/sheet.asset";

const root = document.getElementById("root");

const SCALE = 2;
const GRID_SIZE = 16 * SCALE;

async function draw() {
  console.log("Boiiiii this actually worked LET'S HOOT N HOLLER");
  const canvas = createCanvas();
  root?.append(canvas);

  const drawable = editCanvas(canvas);
  const sprites = await loader();

  drawable
    .drawSprite(
      sprites[0],
      window.innerWidth / 2 - GRID_SIZE * 1.5,
      window.innerHeight / 2,
      SCALE
    )
    .drawSprite(
      sprites[1],
      window.innerWidth / 2 - GRID_SIZE * 0.5,
      window.innerHeight / 2,
      SCALE
    )
    .drawSprite(
      sprites[2],
      window.innerWidth / 2 + GRID_SIZE * 0.5,
      window.innerHeight / 2,
      SCALE
    );
}

void draw();
