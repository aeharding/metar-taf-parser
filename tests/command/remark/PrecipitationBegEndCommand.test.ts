import en from "locale/en";
import { Descriptive, Phenomenon } from "model/enum";
import { CommandExecutionError } from "commons/errors";
import { Remark, RemarkType } from "command/remark";
import { PrecipitationBegEndCommand } from "command/remark/PrecipitationBegEndCommand";

describe("PrecipitationBegEndCommand", () => {
  const command = new PrecipitationBegEndCommand(en);

  (() => {
    const code = "RAB20E51";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: " rain beginning at :20 ending at :51",
            raw: code,
            phenomenon: Phenomenon.RAIN,
            startMin: 20,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "RAB0120E0151";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: " rain beginning at 01:20 ending at 01:51",
            raw: code,
            phenomenon: Phenomenon.RAIN,
            startHour: 1,
            startMin: 20,
            endHour: 1,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BLRAB0120E0151";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: "blowing rain beginning at 01:20 ending at 01:51",
            raw: code,
            descriptive: Descriptive.BLOWING,
            phenomenon: Phenomenon.RAIN,
            startHour: 1,
            startMin: 20,
            endHour: 1,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  test("invalid descriptive should throw on execute", () => {
    expect(() => command.execute("BBRAB0120E0151", [])).toThrowError(
      CommandExecutionError
    );
  });

  test("invalid phenomenon should throw on execute", () => {
    expect(() => command.execute("BLRRB0120E0151", [])).toThrowError(
      CommandExecutionError
    );
  });
});
