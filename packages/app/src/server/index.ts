import dotenv from "dotenv";
import path from "path";

// prettier-ignore
dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env",
    process.env.NODE_ENV === "development" ? "dev.env" : "prod.env"
  ),
});

// prettier-ignore
import { startServer } from "./server";
startServer();
