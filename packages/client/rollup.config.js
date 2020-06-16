import commonJS from "rollup-plugin-commonjs";
import html from "rollup-plugin-generate-html-template";
import image from "@rollup/plugin-image";
import node from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "WowBasic",
  },
  plugins: [
    node(),
    commonJS(),
    image(),
    typescript(),
    html({
      template: "./src/index.html",
      target: "index.html",
    }),
  ],
};
