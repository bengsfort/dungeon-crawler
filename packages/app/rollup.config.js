import commonJS from "rollup-plugin-commonjs";
// import css from "rollup-plugin-css-porter";
import html from "rollup-plugin-generate-html-template";
import image from "@rollup/plugin-image";
import node from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/client/index.ts",
  output: {
    file: "dist/client/bundle.js",
    format: "iife",
    name: "GameClient",
  },
  plugins: [
    node(),
    commonJS(),
    image(),
    // css(),
    typescript({
      tsconfig: "./tsconfig.client.json",
    }),
    html({
      template: "./src/client/index.html",
      target: "./dist/client/index.html",
    }),
  ],
};
