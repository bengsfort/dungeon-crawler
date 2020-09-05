const fs = require("fs");
const path = require("path");
const cluster = require("cluster");
const utils = require("./script-utils");

// Shamelessly taken from this gist from @jamestthompson3
// https://gist.github.com/jamestthompson3/97f824d21c55d034f1d3e22bc6720b3f

const entry = utils.getArgValue(
  process.argv,
  "--entry",
  "./dist/server/index.js"
);
const allowedExtensions = utils
  .getArgValue(process.argv, "--ext", ".js,.json")
  .split(",");

function hasAllowedExtension(name) {
  return allowedExtensions.includes(path.extname(name));
}

async function watchChanges(file) {
  const targetDir = path.dirname(file);
  const fileName = path.basename(file);
  const dir = await fs.promises.opendir(targetDir);

  await walkRecursive(dir, fileName);
}

async function walkRecursive(dir, fileName) {
  for await (const dirent of dir) {
    if (dirent.isFile() && hasAllowedExtension(dirent.name)) {
      watchFile(dirent.name, dir.path, fileName);
    } else if (dirent.isDirectory()) {
      const recDir = await fs.promises.opendir(`${dir.path}/${dirent.name}`);
      walkRecursive(recDir);
    }
  }
}

function watchFile(name, path) {
  console.log(`Watching ${path}/${name} for changes.`);
  fs.watch(`${path}/${name}`, (eventType) => {
    if (eventType === "change") {
      for (const id in cluster.workers) {
        const worker = cluster.workers[id];
        worker.kill("SIGTERM");
      }
      cluster.setupMaster({
        exec: entry,
      });
      cluster.fork();
    }
  });
}

// Run
if (cluster.isMaster) {
  console.log(`Running ${entry}.`);
  console.log(`----------------------`);
  cluster.setupMaster({
    exec: entry,
  });
  cluster.fork();
  watchChanges(entry);
}
