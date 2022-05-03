import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { HourlyPrecipitationAmountCommand } from "../../../src/command/remark/HourlyPrecipitationAmountCommand";

describe("HourlyPrecipitationAmountCommand", () => {
  const command = new HourlyPrecipitationAmountCommand(en);
  const code = "P0008";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyPrecipitationAmount,
          description:
            "8/100 of an inch of precipitation fell in the last hour",
          raw: code,
          amount: 0.08,
        },
      ]);
    });
  });
});
