import path from "path";

export const DIST_DIR = path.resolve(process.cwd(), "dist");
export const PORT = 3000;

export enum WorkerType {
  idle = "idle",
  room = "room",
}
