import app from "./app";
// prettier-ignore
import path from "path";

let server;
if (app.get("is_idle") === false) {
  server = app.listen(app.get("port"), () => {
    console.log(
      `App is running at ${app.get("server_url")}:${app.get(
        "port"
      )} in ${app.get("env")} mode`
    );
  });
}

export default server;
