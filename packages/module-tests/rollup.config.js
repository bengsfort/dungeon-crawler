import commonJS from "rollup-plugin-commonjs";
import html from "rollup-plugin-generate-html-template";
import image from "@rollup/plugin-image";
import node from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const makeConfig = (name, namespace) => ({
  input: `src/${name}/index.ts`,
  output: {
    file: `dist/${name}/bundle.js`,
    format: "iife",
    name: namespace,
  },
  plugins: [
    node(),
    commonJS(),
    image(),
    typescript(),
    html({
      template: "./src/template.html",
      target: `./dist/${name}/index.html`,
    }),
  ],
});

export default [makeConfig("spritesheet-test", "SpritesheetTest")];
