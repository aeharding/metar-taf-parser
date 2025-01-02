import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { NextForecastByCommand } from "command/remark/NextForecastByCommand";

describe("NextForecastByCommand", () => {
  const command = new NextForecastByCommand(en);
  const code = "NXT FCST BY 160300Z";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.NextForecastBy,
          description: "next forecast by 16, 03:00Z",
          raw: code,

          day: 16,
          hour: 3,
          minute: 0,
        },
      ]);
    });
  });
});
