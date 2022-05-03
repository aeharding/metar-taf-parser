import { exec } from "child_process";
import { camelCase } from "lodash";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const tscAlias = () => {
  return {
    name: "tsAlias",
    buildStart: () => {
      return new Promise((resolve, reject) => {
        exec("tsc-alias", function callback(error, stdout, stderr) {
          if (stderr || error) {
            reject(stderr || error);
          } else {
            resolve(stdout);
          }
        });
      });
    },
  };
};

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
        dir: "dist",
        name: camelCase(libraryName),
        format: "es",
      },
    ],
    watch: {
      include: "src/**",
    },
    plugins: [typescript(), tscAlias()],
  },
  {
    input: "./dist/index.d.ts",
    output: [{ file: "metar-taf-parser.d.ts", format: "es" }],
    plugins: [tscAlias(), dts()],
  },
];
