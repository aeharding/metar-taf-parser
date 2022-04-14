import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { WindPeakCommand } from "command/remark/WindPeakCommandCommand";

describe("WindPeakCommand", () => {
  const command = new WindPeakCommand(en);
  const code = "PK WND 29027/2250";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WindPeak,
          description: "peak wind of 27 knots from 290 degrees at 22:50",
          raw: code,
          speed: 27,
          degrees: 290,
          startHour: 22,
          startMinute: 50,
        },
      ]);
    });
  });
});
