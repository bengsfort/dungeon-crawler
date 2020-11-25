import path from "path";

export const DIST_DIR = path.resolve(process.cwd(), "dist");

export enum WorkerType {
  idle = "idle",
  room = "room",
}
