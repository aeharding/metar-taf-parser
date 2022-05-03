import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { SnowIncreaseCommand } from "../../../src/command/remark/SnowIncreaseCommand";

describe("SnowIncreaseCommand", () => {
  const command = new SnowIncreaseCommand(en);
  const code = "SNINCR 2/10";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowIncrease,
          description:
            "snow depth increase of 2 inches in the past hour with a total depth on the ground of 10 inches",
          raw: code,
          inchesLastHour: 2,
          totalDepth: 10,
        },
      ]);
    });
  });
});
