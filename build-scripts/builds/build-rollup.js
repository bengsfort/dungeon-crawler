const loadConfigFile = require("rollup/dist/loadConfigFile");
const rollup = require("rollup");

async function getConfig(cfgPath) {
  console.log("Using config at:", cfgPath);
  const { warnings, options } = await loadConfigFile(cfgPath);
  console.log(`Rollup detected ${warnings.count} warnings.`);
  warnings.flush();
  return options;
}

async function watch(configPath) {
  const options = getConfig(configPath);
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

async function compile(configPath) {
  const options = getConfig(configPath);
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

const config = path.resolve(
  utils.getArgValue(process.argv, "--config", "./rollup.config.js")
);
const watchMode = utils.getArgExists(process.argv, "--watch");

if (watchMode) {
  watch(config);
} else {
  compile(config);
}
