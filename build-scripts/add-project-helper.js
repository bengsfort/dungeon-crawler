const readline = require("readline");
const fs = require("fs");
const path = require("path");

const TEMPLATE_DIR = path.resolve(__dirname, "package-template");
const PACKAGES_DIR = path.resolve(__dirname, "../packages");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const awaitQuestion = (question) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

const exists = (checkPath) =>
  new Promise((resolve) => {
    fs.promises
      .access(checkPath, fs.constants.R_OK | fs.constants.W_OK)
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });

const copyDirectory = async (dirPath, targetPrefix) => {
  try {
    const files = await fs.promises.readdir(dirPath);

    for (let i = 0; i < files.length; i++) {
      const fPath = path.resolve(dirPath, files[i]);
      const stats = await fs.promises.stat(fPath);

      if (stats.isDirectory()) {
        await copyDirectory(fPath, path.join(targetPrefix, files[i]));
      } else {
        const target = path.resolve(PACKAGES_DIR, targetPrefix, files[i]);
        console.log("Writing:", target);
        await fs.promises.copyFile(fPath, target);
      }
    }
  } catch (e) {
    console.error("Couldn't copy template file due to an error. :(\n", e);
  }
};

const main = async () => {
  console.log("Creating a new @dungeon-crawler/* package.\n");

  const packageName = await awaitQuestion("Package name:\t");
  const packageDesc = await awaitQuestion("Description:\t");
  const packageAuthor = await awaitQuestion("Author:\t");

  const safeName = slugify(packageName);

  if (await exists(path.resolve(PACKAGES_DIR, safeName))) {
    console.error(
      "\nWARNING! This package seems to already exist. Please remove it before continuing.\n"
    );
    process.exit(0);
  }

  console.log("\nCreating new package...");
  await copyDirectory(TEMPLATE_DIR, safeName);

  try {
    console.log("\nUpdating package.json with provided info...");
    const packagePath = path.resolve(TEMPLATE_DIR, safeName, "package.json");
    const packageJson = await fs.promises.readFile(packagePath, "utf-8");
    const packageContents = packageJson
      .toString()
      .replace("%name%", safeName)
      .replace("%description%", packageDesc)
      .replace("%author%", packageAuthor);
    await fs.promises.writeFile(packagePath, packageContents);
    console.log("Finished updating package.json.");
  } catch (e) {
    console.error(
      "There was an error trying to update the package.json file. Try updating it manually :("
    );
  }

  console.log(`
    You're good to go!
    
    For TypeScript to build properly, please add the following to
    the \`references\` prop of the root \`tsconfig.json\`:
    
    { "path": "packages/${safeName}" }`);
  process.exit(0);
};

main();
