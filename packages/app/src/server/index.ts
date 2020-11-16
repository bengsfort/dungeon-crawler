import { DIST_DIR, PORT } from "./constants";

import { Server } from "@dungeon-crawler/network";
import cluster from "cluster";
import express from "express";
import path from "path";
import { setupGameRoom } from "./game-room";
import { setupMaster } from "./master";

const app = Server.start(express());
app.set("view engine", "ejs");
app.set("views", path.join(DIST_DIR, "/server/views"));

if (cluster.isMaster) {
  setupMaster(app);
} else {
  setupGameRoom(app);
}
