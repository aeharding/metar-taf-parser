import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { SunshineDurationCommand } from "../../../src/command/remark/SunshineDurationCommand";

describe("SunshineDurationCommand", () => {
  const command = new SunshineDurationCommand(en);
  const code = "98460";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SunshineDuration,
          description: "460 minutes of sunshine",
          raw: code,
          duration: 460,
        },
      ]);
    });
  });
});
