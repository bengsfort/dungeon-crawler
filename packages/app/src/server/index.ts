import express from "express";
import { handler } from "./testMessage";
import path from "path";

const __dist_dir = path.resolve(process.cwd(), "dist");
const app = express();

// Use dynamic port eventually
const port = 3000;

app.use("/", express.static(path.join(__dist_dir, "client")));

app.listen(port, handler(port));
