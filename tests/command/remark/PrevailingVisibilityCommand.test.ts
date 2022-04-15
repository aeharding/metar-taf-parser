import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { PrevailingVisibilityCommand } from "command/remark/PrevailingVisibilityCommand";

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
          minVisibility: "1/2",
          maxVisibility: "2",
        },
      ]);
    });
  });
});
