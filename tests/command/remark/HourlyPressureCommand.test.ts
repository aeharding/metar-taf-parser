import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { HourlyPressureCommand } from "../../../src/command/remark/HourlyPressureCommand";

describe("HourlyPressureCommand", () => {
  const command = new HourlyPressureCommand(en);
  const code = "52032";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyPressure,
          description:
            "steady or unsteady increase of 3.2 hectopascals in the past 3 hours",
          raw: code,
          code: 2,
          pressureChange: 3.2,
        },
      ]);
    });
  });
});
