import { DIST_DIR, PORT } from "./constants";

import { Server } from "@dungeon-crawler/network";
import cluster from "cluster";
import express from "express";
import { handler } from "./testMessage";
import path from "path";
import { setupGameRoom } from "./game-room";
import { setupMaster } from "./master";

const app = Server.start(express());
app.set("view engine", "ejs");

// Notes:
// This doesn't work in dev mode (since it is already in a child process)
// Getting an EADDRINUSE error; perhaps express doesn't share like the node server does?
// `process.env` stuff isnt getting set in dev mode as master is never getting setup
if (cluster.isMaster) {
  setupMaster(app);
} else {
  setupGameRoom();
}

app.use("/", express.static(path.join(DIST_DIR, "client")));
app.listen(PORT, handler(PORT));
