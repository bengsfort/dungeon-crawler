import { EditableCanvas } from "./canvas";

export type DrawableHandler = (
  canvas: EditableCanvas,
  timestamp?: number
) => void;
