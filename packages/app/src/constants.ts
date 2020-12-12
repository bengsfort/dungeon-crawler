import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env",
    process.env.NODE_ENV === "development" ? "dev.env" : "prod.env"
  ),
});

export const NODE_ENV = process.env.NODE_ENV;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const SERVER_PORT = process.env.SERVER_PORT;
export const SERVER_URL = process.env.SERVER_URL;
export const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_URL = process.env.REDIS_URL;

export enum WorkerType {
  idle = "idle",
  room = "room",
}
