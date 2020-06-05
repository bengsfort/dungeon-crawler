# `@dungeon-crawler/client`

The web client for the dungeon crawler game.

## Getting started

This package was added using the `yarn package:create` helper script, so it follows the following conventions:

- Typescript settings are all inherited from `../../tsconfig.base.json` .
- `src/*` contains the source for the package.
- The package is built into the `dist/*` directory.
- When adding/accessing this package from another package in the workspace, prefix it with `@dungeon-crawler/` .

## Setup

This is a yarn workspaces package, so all you have to do is run `yarn install` from root.

## Commands

- `start` : Start the typescript compiler in watch mode.
- `build` : Build the package using the typescript compiler.
- `clean` : Use `rimraf` to clean any build output from the package.
