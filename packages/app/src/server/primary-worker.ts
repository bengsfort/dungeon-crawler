import { playRouter, roomRouter } from "./routes";

import { DIST_DIR } from "./constants";
import express from "express";
import expressWs from "express-ws";
import path from "path";
import { workers } from "./workers";

export const setupPrimary = (app: expressWs.Application): void => {
  console.log("Setting up PRIMARY worker");
  workers.init();
  app.use("/play", playRouter);
  app.use("/room", roomRouter);
  app.get("/", (req, res) => {
    res.render("index");
  });
  app.use("/", express.static(path.join(DIST_DIR, "client")));
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`PRIMARY server running on port ${process.env.SERVER_PORT}`);
  });
};
