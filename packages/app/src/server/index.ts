import { Server } from "@dungeon-crawler/network";
import express from "express";
import { handler } from "./testMessage";
import path from "path";

const __dist_dir = path.resolve(process.cwd(), "dist");
const port = 3000;

const app = Server.start(express(), "/socket");
app.get("/test", (req, res) => {
  res.send("yes");
});
app.use("/", express.static(path.join(__dist_dir, "client")));
app.listen(port, handler(port));
