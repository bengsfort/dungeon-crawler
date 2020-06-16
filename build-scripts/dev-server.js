const express = require("express");
const path = require("path");

const [_nodePath, _file, ...args] = process.argv;

const getArgValue = (name, defaultVal) => {
  const index = args.indexOf(name);
  if (index < 0) return defaultVal;
  return args[index + 1];
};

const port = getArgValue("--port", 3000);
const staticDir = getArgValue("--static", "./dev-server");

const cwd = process.cwd();
const app = express();

console.log(
  `Starting dev server up using port ${port} and directory ${staticDir}`
);

app.use(express.static(path.join(cwd, staticDir)));

app.listen(port, () => {
  console.log(`Dev server up and running on ${port}`);
});
