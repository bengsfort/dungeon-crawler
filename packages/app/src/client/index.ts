// import "./css/normalize.css";

import { createCanvas } from "@dungeon-crawler/renderer";

const root = document.getElementById("root");

function main() {
  const canvas = createCanvas();
  root?.append(canvas);

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#ffffff";
  context.fillText("Hello, cruel world", canvas.width / 2, canvas.height / 2);
}

main();
