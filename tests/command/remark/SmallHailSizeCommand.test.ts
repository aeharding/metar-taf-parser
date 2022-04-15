import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { SmallHailSizeCommand } from "command/remark/SmallHailSizeCommand";

describe("SmallHailSizeCommand", () => {
  const command = new SmallHailSizeCommand(en);
  const code = "GR LESS THAN 1/4";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SmallHailSize,
          description:
            "largest hailstones with a diameter less than 1/4 inches",
          raw: code,
          size: "1/4",
        },
      ]);
    });
  });
});
