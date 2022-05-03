import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { SnowDepthCommand } from "../../../src/command/remark/SnowDepthCommand";

describe("SnowDepthCommand", () => {
  const command = new SnowDepthCommand(en);
  const code = "4/011";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowDepth,
          description: "snow depth of 11 inches",
          raw: code,
          depth: 11,
        },
      ]);
    });
  });
});
