import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { IceAccretionCommand } from "command/remark/IceAccretionCommand";

describe("IceAccretionCommand", () => {
  const command = new IceAccretionCommand(en);
  const code = "l1001";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.IceAccretion,
          description:
            "1/100 of an inch of ice accretion in the past 1 hour(s)",
          raw: code,
          amount: 0.01,
          periodInHours: 1,
        },
      ]);
    });
  });
});
