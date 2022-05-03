import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { WaterEquivalentSnowCommand } from "../../../src/command/remark/WaterEquivalentSnowCommand";

describe("WaterEquivalentSnowCommand", () => {
  const command = new WaterEquivalentSnowCommand(en);
  const code = "933125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WaterEquivalentSnow,
          description: "water equivalent of 12.5 inches of snow",
          raw: code,
          amount: 12.5,
        },
      ]);
    });
  });
});
