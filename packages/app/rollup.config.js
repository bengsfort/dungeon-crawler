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
    input: "src/public/client/room.ts",
    output: {
      format: "iife",
      dir: "dist/public/client",
      name: "GameClient",
    },
    plugins: [
      node(),
      commonJS({
        namedExports: {
          "@dungeon-crawler/network": ["WsClient"],
        },
      }),
      image(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfig: "tsconfig.client.json",
      }),
      json(),
      assets({
        assets: ["../sprites", "../css", "../favicon.ico"],
      }),
    ],
  },
  {
    input: "src/public/client/index.ts",
    output: {
      format: "iife",
      file: "dist/public/client/index.js",
      name: "GameEntrypoint",
    },
    plugins: [
      node(),
      commonJS(),
      typescript({
        rollupCommonJSResolveHack: true,
        tsconfig: "tsconfig.client.json",
      }),
    ],
  },
];
