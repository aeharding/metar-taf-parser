import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { TowerVisibilityCommand } from "command/remark/TowerVisibilityCommand";

describe("TowerVisibilityCommand", () => {
  const command = new TowerVisibilityCommand(en);
  const code = "TWR VIS 3";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TowerVisibility,
          description: "control tower visibility of 3 statute miles",
          raw: code,
          distance: "3",
        },
      ]);
    });
  });
});
