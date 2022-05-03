import { PrecipitationBegCommand } from "../../../src/command/remark/PrecipitationBegCommand";
import en from "../../../src/locale/en";
import { Descriptive, Phenomenon, Remark, RemarkType } from "../../../src";

describe("PrecipitationBegCommand", () => {
  const command = new PrecipitationBegCommand(en);

  (() => {
    const code = "RAB20";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBeg,
            description: "rain beginning at :20",
            raw: "RAB20",
            startMin: 20,
            phenomenon: Phenomenon.RAIN,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "RAB0120";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBeg,
            description: "rain beginning at 01:20",
            raw: "RAB0120",
            phenomenon: Phenomenon.RAIN,
            startHour: 1,
            startMin: 20,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BLRAB12";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBeg,
            description: "blowing rain beginning at :12",
            raw: "BLRAB12",
            phenomenon: Phenomenon.RAIN,
            descriptive: Descriptive.BLOWING,
            startMin: 12,
          },
        ]);
      });
    });
  })();
});
