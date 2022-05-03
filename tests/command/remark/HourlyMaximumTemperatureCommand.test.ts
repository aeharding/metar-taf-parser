import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { HourlyMaximumTemperatureCommand } from "command/remark/HourlyMaximumTemperatureCommand";

describe("HourlyMaximumTemperatureCommand", () => {
  const command = new HourlyMaximumTemperatureCommand(en);
  const code = "10272";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMaximumTemperature,
          description: "6-hourly maximum temperature of 27.2°C",
          raw: code,
          max: 27.2,
        },
      ]);
    });
  });
});
