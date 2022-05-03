import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { PrecipitationAmount24HourCommand } from "../../../src/command/remark/PrecipitationAmount24HourCommand";

describe("PrecipitationAmount24HourCommand", () => {
  const command = new PrecipitationAmount24HourCommand(en);
  const code = "70125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrecipitationAmount24Hour,
          description: "1.25 inches of precipitation fell in the last 24 hours",
          raw: code,
          amount: 1.25,
        },
      ]);
    });
  });
});
