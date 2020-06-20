const cluster = require("cluster");
const fs = require("fs");
const path = require("path");

const loadConfigFile = require("rollup/dist/loadConfigFile");
const rollup = require("rollup");

const [_nodePath, _file, ...args] = process.argv;

const cwd = process.cwd();
const configPath = path.resolve(cwd, "./rollup.config.js");

const getArgValue = (name, defaultVal) => {
  const index = args.indexOf(name);
  if (index < 0) return defaultVal;
  return args[index + 1];
};

const port = getArgValue("--port", 3000);
const staticDir = getArgValue("--static", "dist/");

if (cluster.isMaster) {
  // Fork this to start actual dev server
  cluster.setupMaster({
    args: ["--port", port, "--static", staticDir],
    exec: "../../build-scripts/dev-server.js",
  });
  cluster.fork();
  watchRollup();
}

async function watchRollup() {
  const { warnings, options } = await loadConfigFile(configPath);
  console.log(`Rollup detected ${warnings.count} warnings.`);
  warnings.flush();
  const watch = rollup.watch(options);
  watch.on("restart", () => console.log("Rollup watcher restarted"));
  watch.on("change", (id) =>
    console.log("ROllup watcher detected a change:", id)
  );
  watch.on("event", async (event) => {
    if (event.code === "END") {
      console.log("Rollup bundle built.");
    }
  });
}
