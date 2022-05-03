import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { SurfaceVisibilityCommand } from "command/remark/SurfaceVisibilityCommand";

describe("SurfaceVisibilityCommand", () => {
  const command = new SurfaceVisibilityCommand(en);
  const code = "SFC VIS 8";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SurfaceVisibility,
          description: "surface visibility of 8 statute miles",
          raw: code,
          distance: 8,
        },
      ]);
    });
  });
});
