/* eslint-disable @typescript-eslint/no-namespace */
import { WorkerType } from "../constants";

declare global {
  namespace session {
    export interface SessionData {
      username: string;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "production" | "development";
      SERVER_PORT: number;
      WEBSOCKET_PORT: number;
      SESSION_SECRET: string;
      REDIS_URL: string;
      REDIS_PORT: number;
      // Child process specific
      WORKER_TYPE?: WorkerType;
      ROOM_ID?: string;
    }
  }
}
