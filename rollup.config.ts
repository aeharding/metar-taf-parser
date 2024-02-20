import { exec } from "child_process";
import lodash from "lodash";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const tsconfig = "tsconfig.build.json";

const tscAlias = () => {
  return {
    name: "tsAlias",
    buildStart: () => {
      return new Promise((resolve, reject) => {
        exec(
          `tsc-alias -p ${tsconfig}`,
          function callback(error, stdout, stderr) {
            if (stderr || error) {
              reject(stderr || error);
            } else {
              resolve(stdout);
            }
          }
        );
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
        name: lodash.camelCase(libraryName),
        format: "es",
      },
    ],
    watch: {
      include: "src/**",
    },
    plugins: [typescript({ tsconfig }), tscAlias()],
  },
  {
    input: "./dist/index.d.ts",
    output: [{ file: "metar-taf-parser.d.ts", format: "es" }],
    plugins: [tscAlias(), dts()],
  },
];
