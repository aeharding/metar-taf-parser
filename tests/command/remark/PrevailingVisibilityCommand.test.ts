import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { PrevailingVisibilityCommand } from "../../../src/command/remark/PrevailingVisibilityCommand";

describe("PrevailingVisibilityCommand", () => {
  const command = new PrevailingVisibilityCommand(en);
  const code = "VIS 1/2V2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrevailingVisibility,
          description: "variable prevailing visibility between 1/2 and 2 SM",
          raw: code,
          minVisibility: 0.5,
          maxVisibility: 2,
        },
      ]);
    });
  });
});
