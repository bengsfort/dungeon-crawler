# Dungeon Crawler

This is the workspace for a JS/TS Dungeon Crawler project. Think of it is a simplified, top down 2D version of WoW that allows you to do boss fights with friends in real time. At least that is the goal.

## Project setup

This project has everything you need to get started. Simply clone it down, `yarn install` in the root, and then you are good to go.

### Commands

Workspace root commands are as follows:

* `package:create` : Runs the automated interactive package creation helper script.
* `build` : Runs the `build` command in *all* workspaces.
* `build:packages` : Compiles all Typescript packages using the Typescript compiler.
* `clean` : Runs the `clean` command in *all* workspaces.
* `lint` : Lints the entire codebase using eslint.
* `lint:fix` : Lints the entire codebase and then tries to fix any fixable errors/warnings.
* `format` : Runs prettier against the entire codebase to format it.
* `format:check` : Runs prettier with the `--list-different` flag to list all files that would be updated via `format` .

### Module Commands

All modules are different, but there are two commands they *must* implement (even if it is a simple noop):

* `build` : Generally, this just runs the Typescript compiler. If a package doesn't need this, just use `echo 'skipping'` .
* `clean` : This generally uses `rimraf` to clean the build output directory.

If you use the `yarn package:create` command from the root to create your package, these two commands will be added for you and you won't need to worry about them. Check the readme file for a particular module to learn more about them.

### Structure

This project has a packaged structure to maintain simplicity and reusability of modules; ie. we can use the same core gameplay loop/rules on the server and client using the exact same module, just imported by different runtimes (client/server).

* `/packages/*` : The packages directory includes all modules necessary for the game + server. Each one is it's own yarn module/workspace.
* `/build-scripts` : The build scripts folder includes custom scripts to make tasks within the project easier.

### `yarn package:create` 

This command runs a helper script that launches an interactive templater for adding a new package to the project. Simply input the package name, description, author, and it will create the directory in the `/packages/*` directory and copy the package template into it. All you have to do after that is add your project to the `tsconfig.json` in the root.

Example usage:

``` 
$ yarn package:create
yarn run v1.22.4
$ node ./build-scripts/add-project-helper.js
Creating a new @dungeon-crawler/* package.

Package name: server
Description: Server module for the js dungeon crawler project.
Author: Matt Bengston <bengsfort@gmail.com>

Creating new package...
Writing: C:\source\dungeon-crawler\packages\server\package.json
Writing: C:\source\dungeon-crawler\packages\server\src\index.ts
Writing: C:\source\dungeon-crawler\packages\server\tsconfig.json

Updating package.json with provided info...
Finished updating package.json.
You're good to go!
For TypeScript to build properly, please add the following to
the `references` prop of the root `tsconfig.json` :

   { "path": "packages/server" }

Happy coding :)

Done in 20.67s.
```

Here are the steps:

1. Run `yarn package:create` from the project root.
2. Input your package name. This will be used for the directory + `package.json` name field. It gets slugified.
3. Optionally, input a package description.
4. Input your author name, in standard `package.json` format.
5. Update your `references` in the root `tsconfig.json` with your package:

``` 
    { "path" : "packages/package-name" }
```

6. Start working!
