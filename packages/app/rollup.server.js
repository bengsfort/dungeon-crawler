import assets from "rollup-plugin-copy-assets";
import builtins from "builtin-modules";
import commonJS from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/server/index.ts",
  external: builtins,
  output: {
    format: "cjs",
    dir: "dist/server",
    name: "ServerClient",
  },
  plugins: [
    resolve(),
    assets({
      assets: [
        "src/server/views",
      ],
    }),
    commonJS({
      dynamicRequireTargets: ["../../node_modules/ejs/*.js"],
      ignore: ["ejs", "jade"],
    }),
    typescript({
      tsconfig: "tsconfig.server.json",
    }),
    json(),
  ],
};
