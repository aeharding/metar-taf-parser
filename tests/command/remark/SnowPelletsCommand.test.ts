import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { SnowPelletsCommand } from "../../../src/command/remark/SnowPelletsCommand";

describe("SnowPelletsCommand", () => {
  const command = new SnowPelletsCommand(en);
  const code = "GS HVY";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowPellets,
          description: "heavy snow pellets",
          raw: code,
          amount: "HVY",
        },
      ]);
    });
  });
});
