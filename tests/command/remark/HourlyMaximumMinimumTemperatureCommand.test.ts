import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { HourlyMaximumMinimumTemperatureCommand } from "../../../src/command/remark/HourlyMaximumMinimumTemperatureCommand";

describe("HourlyMaximumMinimumTemperatureCommand", () => {
  const command = new HourlyMaximumMinimumTemperatureCommand(en);
  const code = "400121023";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMaximumMinimumTemperature,
          description:
            "24-hour maximum temperature of 1.2°C and 24-hour minimum temperature of -2.3°C",
          raw: code,
          max: 1.2,
          min: -2.3,
        },
      ]);
    });
  });
});
