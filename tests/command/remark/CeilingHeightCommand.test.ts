import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { CeilingHeightCommand } from "../../../src/command/remark/CeilingHeightCommand";

describe("CeilingHeightCommand", () => {
  const command = new CeilingHeightCommand(en);

  (() => {
    const code = "CIG 005V010";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.CeilingHeight,
            description: "ceiling varying between 500 and 1000 feet",
            raw: code,
            min: 500,
            max: 1000,
          },
        ]);
      });
    });
  })();
});
