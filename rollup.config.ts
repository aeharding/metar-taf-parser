import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import { camelCase } from "lodash";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";

const pkg = require("./package.json");

const libraryName = "metar-taf-parser";

export default {
  input: {
    index: "src/index.ts",

    "locale/en": "src/locale/en.ts",
    "locale/de": "src/locale/de.ts",
    "locale/fr": "src/locale/fr.ts",
    "locale/it": "src/locale/it.ts",
    "locale/pl": "src/locale/pl.ts",
    "locale/zh-CN": "src/locale/zh-CN.ts",
  },
  output: [
    {
      dir: "dist",
      name: camelCase(libraryName),
      format: "commonjs",
      sourcemap: true,
    },
    // { file: pkg.module, format: "es", sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: "src/**",
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
};
