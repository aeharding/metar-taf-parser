import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { HourlyMinimumTemperatureCommand } from "../../../src/command/remark/HourlyMinimumTemperatureCommand";

describe("HourlyMinimumTemperatureCommand", () => {
  const command = new HourlyMinimumTemperatureCommand(en);
  const code = "20283";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMinimumTemperature,
          description: "6-hourly minimum temperature of 28.3°C",
          raw: code,
          min: 28.3,
        },
      ]);
    });
  });
});
