// import css from "rollup-plugin-css-porter";
import assets from "rollup-plugin-copy-assets";
import commonJS from "rollup-plugin-commonjs";
import html from "rollup-plugin-generate-html-template";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import node from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/client/index.ts",
  output: {
    // file: "dist/client/bundle.js",
    format: "module",
    dir: "dist/client",
    name: "GameClient",
  },
  plugins: [
    node(),
    commonJS(),
    image(),
    // css(),
    typescript({
      tsconfig: "tsconfig.client.json",
    }),
    html({
      template: "./src/client/index.html",
      target: "./dist/client/index.html",
    }),
    json(),
    assets({
      assets: ["src/client/tilemaps"],
    }),
  ],
};
