// import css from "rollup-plugin-css-porter";

import assets from "rollup-plugin-copy-assets";
import commonJS from "rollup-plugin-commonjs";
import html from "rollup-plugin-generate-html-template";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import node from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: "src/client/room.ts",
    output: {
      format: "module",
      dir: "dist/client",
      name: "GameClient",
    },
    plugins: [
      node(),
      commonJS(),
      image(),
      typescript({
        tsconfig: "tsconfig.client.json",
      }),
      html({
        template: "./src/client/index.html",
        target: "./dist/client/index.html",
      }),
      json(),
      assets({
        assets: [
          "src/client/tilemaps",
          "src/client/sprites",
          "src/client/css",
          "src/client/favicon.ico",
        ],
      }),
    ],
  },
  {
    input: "src/client/index.ts",
    output: {
      format: "module",
      file: "dist/client/index.js",
      name: "GameEntrypoint",
    },
    plugins: [
      node(),
      commonJS(),
      typescript({
        tsconfig: "tsconfig.client.json",
      }),
    ],
  },
];
