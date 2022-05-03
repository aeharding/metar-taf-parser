import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { HailSizeCommand } from "../../../src/command/remark/HailSizeCommand";

describe("HailSizeCommand", () => {
  const command = new HailSizeCommand(en);

  (() => {
    const code = "GR 4";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HailSize,
            description: "largest hailstones with a diameter of 4 inches",
            raw: code,
            size: 4,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "GR 1 1/2";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HailSize,
            description: "largest hailstones with a diameter of 1 1/2 inches",
            raw: code,
            size: 1.5,
          },
        ]);
      });
    });
  })();
});
