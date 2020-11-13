import { GameEnvSetup, Server } from "@dungeon-crawler/network";

import express from "express";
import { handler } from "./testMessage";
import path from "path";

const __dist_dir = path.resolve(process.cwd(), "dist");
const port = 3000;

const app = Server.start(express(), "/socket");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// @todo: Proper route definitions; dev route definitions for testing worlds directly
// @todo: Use same model as among us: create a room, start in sandbox, once everyone is ready load game
app.get("/", (req, res) => {
  const envSetup: GameEnvSetup = {
    roomId: "henlo",
    world: "sandbox",
  };
  res.render("index", { envConfig: envSetup });
});

app.use("/", express.static(path.join(__dist_dir, "client")));
app.listen(port, handler(port));
