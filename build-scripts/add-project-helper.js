const fs = require("fs");
const path = require("path");
const readline = require("readline");

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
    const targetDir = path.resolve(PACKAGES_DIR, targetPrefix);
    if (!(await exists(targetDir)))
      await fs.promises.mkdir(path.resolve(PACKAGES_DIR, targetPrefix));

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

const replaceFileKeywords = async (file, pName, pDescription, pAuthor) => {
  try {
    const fileContents = await fs.promises.readFile(file, "utf-8");
    const updatedContents = fileContents
      .toString()
      .replace("%name%", pName)
      .replace("%description%", pDescription)
      .replace("%author%", pAuthor);
    await fs.promises.writeFile(file, updatedContents);
  } catch (e) {
    console.error(
      "There was an error trying to update the template:\n" +
        file +
        "\nTry updating it manually :(",
      e
    );
  }
};

const main = async () => {
  console.log("Creating a new @dungeon-crawler/* package.\n");

  const packageName = await awaitQuestion("Package name: ");
  const packageDesc = await awaitQuestion("Description: ");
  const packageAuthor = await awaitQuestion("Author: ");

  const safeName = slugify(packageName);

  if (await exists(path.resolve(PACKAGES_DIR, safeName))) {
    console.error(
      "\nWARNING! This package seems to already exist. Please remove it before continuing.\n"
    );
    process.exit(0);
  }

  console.log("\nCreating new package...");
  await copyDirectory(TEMPLATE_DIR, safeName);

  console.log("\nUpdating package.json with provided info...");
  const packagePath = path.resolve(PACKAGES_DIR, safeName, "package.json");
  await replaceFileKeywords(
    packagePath,
    packageName,
    packageDesc,
    packageAuthor
  );
  console.log("Finished updating package.json.");

  console.log("\nUpdating README.md with provided info...");
  const readmePath = path.resolve(PACKAGES_DIR, safeName, "README.md");
  await replaceFileKeywords(
    readmePath,
    packageName,
    packageDesc,
    packageAuthor
  );
  console.log("Finished updating README.md.\n");

  console.log("You're good to go!\n");
  console.log("For TypeScript to build properly, please add the following to");
  console.log("the `references` prop of the root `tsconfig.json`:\n");
  console.log(`   { "path": "packages/${safeName}" }`);
  console.log("\nHappy coding :)\n");
  process.exit(0);
};

main();
