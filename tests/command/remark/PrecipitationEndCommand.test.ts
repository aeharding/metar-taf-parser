import { PrecipitationEndCommand } from "../../../src/command/remark/PrecipitationEndCommand";
import en from "../../../src/locale/en";
import { Descriptive, Phenomenon, Remark, RemarkType } from "../../../src";

describe("PrecipitationEndCommand", () => {
  const command = new PrecipitationEndCommand(en);

  (() => {
    const code = "RAE20";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationEnd,
            description: "rain ending at :20",
            raw: "RAE20",
            endMin: 20,
            phenomenon: Phenomenon.RAIN,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "RAE0120";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationEnd,
            description: "rain ending at 01:20",
            raw: "RAE0120",
            phenomenon: Phenomenon.RAIN,
            endHour: 1,
            endMin: 20,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BLRAE12";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationEnd,
            description: "blowing rain ending at :12",
            raw: "BLRAE12",
            phenomenon: Phenomenon.RAIN,
            descriptive: Descriptive.BLOWING,
            endMin: 12,
          },
        ]);
      });
    });
  })();
});
