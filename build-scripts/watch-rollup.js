const { getArgExists, getArgValue } = require("./script-utils");

const loadConfigFile = require("rollup/dist/loadConfigFile");
const path = require("path");
const rollup = require("rollup");

const [_node, _file, ...args] = process.argv;

const config = getArgValue(args, "-c", "./rollup.config.js");
const watchMode = getArgExists(args, "-w");

const cwd = process.cwd();
const configPath = path.resolve(cwd, config);

console.log("Using config at:", configPath);

async function watch(options) {
  const watch = rollup.watch(options);
  watch.on("restart", () => console.log("Rollup watcher restarted."));
  watch.on("change", (id) =>
    console.log(`Rollup watcher detected a change: ${id}`)
  );
  watch.on("event", async (event) => {
    if (event.code === "END") {
      console.log("Rollup bundle built.");
    }
  });
}

async function build(options) {
  try {
    if (options.length) {
      return await Promise.all(options.map((opts) => build(opts)));
    }
    console.log("Building", options.input);
    const bundle = await rollup.rollup(options);
    await Promise.all(options.output.map(bundle.write));
  } catch (err) {
    throw err;
  }
}

async function main() {
  const { warnings, options } = await loadConfigFile(configPath);
  console.log(`Rollup detected ${warnings.count} warnings.`);
  warnings.flush();
  if (watchMode) {
    await watch(options);
  } else {
    await build(options);
  }
}

main();
