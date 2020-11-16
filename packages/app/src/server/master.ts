import { DIST_DIR, PORT } from "./constants";

import express from "express";
import expressWs from "express-ws";
import path from "path";
import { roomRouter } from "./routes";
import { workers } from "./workers";

export const setupMaster = (app: expressWs.Application): void => {
  console.log("Setting up master worker");
  workers.init();
  app.use("/room", roomRouter);
  app.get("/", (req, res) => {
    res.render("index");
  });
  app.use("/", express.static(path.join(DIST_DIR, "client")));
  app.listen(PORT, () => {
    console.log(`Master server running on port ${PORT}`);
  });
};
