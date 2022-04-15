import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { HourlyTemperatureDewPointCommand } from "command/remark/HourlyTemperatureDewPointCommand";

describe("HourlyTemperatureDewPointCommand", () => {
  const command = new HourlyTemperatureDewPointCommand(en);

  (() => {
    const code = "T0217";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HourlyTemperatureDewPoint,
            description: "hourly temperature of 21.7°C",
            raw: code,
            temperature: 21.7,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "T02170144";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HourlyTemperatureDewPoint,
            description: "hourly temperature of 21.7°C and dew point of 14.4°C",
            raw: code,
            temperature: 21.7,
            dewPoint: 14.4,
          },
        ]);
      });
    });
  })();
});
