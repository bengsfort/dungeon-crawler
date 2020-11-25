import { DIST_DIR } from "./constants";
import { RedisCache } from "./util";
import { Server } from "@dungeon-crawler/network";
import cluster from "cluster";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import session from "express-session";
import { setupChildProcess } from "./child-process";
import { setupPrimary } from "./primary-worker";

export const startServer = (): void => {
  const app = Server.start(express());
  const RedisStore = connectRedis(session);

  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(
    session({
      store: new RedisStore({
        client: RedisCache.client,
        port: process.env.REDIS_PORT, // @todo: add types
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  app.set("view engine", "ejs");
  app.set("views", path.join(DIST_DIR, "/server/views"));

  if (cluster.isMaster) {
    setupPrimary(app);
  } else {
    setupChildProcess(app);
  }
};
