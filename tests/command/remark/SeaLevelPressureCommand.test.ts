import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { SeaLevelPressureCommand } from "command/remark/SeaLevelPressureCommand";

describe("SeaLevelPressureCommand", () => {
  const command = new SeaLevelPressureCommand(en);
  const code = "SLP117";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SeaLevelPressure,
          description: "sea level pressure of 1011.7 HPa",
          raw: code,
          pressure: 1011.7,
        },
      ]);
    });
  });
});
