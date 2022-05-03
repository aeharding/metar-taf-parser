import { camelCase } from "lodash";
import typescript from "rollup-plugin-typescript2";
import json from "rollup-plugin-json";
import dts from "rollup-plugin-dts";

const libraryName = "metar-taf-parser";

export default [
  {
    input: {
      "metar-taf-parser": "src/index.ts",

      "locale/en": "src/locale/en.ts",
      "locale/de": "src/locale/de.ts",
      "locale/fr": "src/locale/fr.ts",
      "locale/it": "src/locale/it.ts",
      "locale/pl": "src/locale/pl.ts",
      "locale/zh-CN": "src/locale/zh-CN.ts",
    },
    output: [
      {
        dir: ".",
        name: camelCase(libraryName),
        format: "es",
      },
    ],
    watch: {
      include: "src/**",
    },
    plugins: [
      json(),

      // Compile TypeScript files
      typescript({ useTsconfigDeclarationDir: true }),
    ],
  },
  {
    input: "./dist/index.d.ts",
    output: [{ file: "metar-taf-parser.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
