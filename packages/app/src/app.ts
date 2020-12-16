import * as RedisCache from "./util/redis-interface";
// Routes (controllers)
import * as homeControllers from "./controllers/home";
import * as playControllers from "./controllers/play";
import * as roomControllers from "./controllers/room";

import { GameLoop, World } from "@dungeon-crawler/runtime";
import {
  NODE_ENV,
  REDIS_PORT,
  SERVER_PORT,
  SERVER_URL,
  SESSION_SECRET,
  WEBSOCKET_PORT,
  WorkerType,
} from "./constants";

import { Sandbox } from "@dungeon-crawler/world-configs";
import { ServerStateController } from "@dungeon-crawler/runtime/dist/controllers";
import { WsServer } from "@dungeon-crawler/network";
import bodyParser from "body-parser";
import cluster from "cluster";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import express from "express";
import expressWs from "express-ws";
import path from "path";
import session from "express-session";
import { workers } from "./util/workers";

// create express server
const instance = expressWs(express());
const app = instance.app;

// create redis store
const RedisStore = connectRedis(session);

// express config
app.set("server_url", SERVER_URL);
app.set("env", NODE_ENV);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(cookieParser(SESSION_SECRET));
app.use(bodyParser.json());
app.use(
  session({
    store: new RedisStore({
      client: RedisCache.client,
      port: REDIS_PORT, // @todo: add types
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

if (cluster.isMaster) {
  app.set("port", SERVER_PORT || 3000);
  app.set("is_idle", false);
  console.log("Initializing main server.");

  // Main cluster routes
  workers.init();
  app.get("/", homeControllers.getIndex);
  app.get("/play/:roomId", playControllers.getRoom);
  app.post("/room/create", roomControllers.postCreate);
  app.post("/room/join", roomControllers.postJoin);
} else {
  app.set("port", WEBSOCKET_PORT || 3000);
  if (
    process.env.WORKER_TYPE === WorkerType.idle ||
    typeof process.env.ROOM_ID === "undefined"
  ) {
    console.log("Initializing idle server.");
    app.set("is_idle", true);
  } else {
    console.log("Initializing game server for room", process.env.ROOM_ID);
    app.set("is_idle", false);

    const wsServer = new WsServer();
    app.ws(`/play/${process.env.ROOM_ID}`, wsServer.clientConnectionHandler);
    GameLoop.setFixedTickrate(true, 30);
    GameLoop.start(() => {
      const world = new World(Sandbox.map);
      console.log("World created:", world.name);
      world.addController(new ServerStateController(wsServer));
    });
  }
}

export default app;
