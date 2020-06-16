const cluster = require("cluster");
const fs = require("fs");
const path = require("path");

const loadConfigFile = require("rollup/dist/loadConfigFile");
const rollup = require("rollup");

const [_nodePath, _file, ...args] = process.argv;

const cwd = process.cwd();
const configPath = path.resolve(cwd, "./rollup.config.js");

let config;

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
  watchChanges();
}

// Rebuilding
async function watchChanges() {
  fs.promises.opendir();
  const dir = await fs.promises.opendir(path.resolve(cwd, "./src"));
  walkRecursive(dir);
}

async function walkRecursive(dir) {
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      watchFile(dirent.name, dir.path);
    } else {
      const recDir = await fs.promises.opendir(`${dir.path}/${dirent.name}`);
      walkRecursive(recDir);
    }
  }
}

function watchFile(name, path) {
  fs.watch(`${path}/${name}`, async (eventType, fileName) => {
    if (eventType === "change") {
      const { warnings, options } = await loadConfigFile(configPath);
      console.log(`Rollup detected ${warnings.count} warnings.`);
      config.warnings.flush();
      const bundle = await rollup.rollup(options);
      await Promise.all(options.output.map(bundle.write));
    }
  });
}
