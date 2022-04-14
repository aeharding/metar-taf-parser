import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { PrecipitationAmount36HourCommand } from "command/remark/PrecipitationAmount36HourCommand";

describe("PrecipitationAmount36HourCommand", () => {
  const command = new PrecipitationAmount36HourCommand(en);
  const code = "60225";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrecipitationAmount36Hour,
          description: "2.25 inches of precipitation fell in the last 6 hours",
          raw: code,
          periodInHours: 6,
          amount: 2.25,
        },
      ]);
    });
  });
});
