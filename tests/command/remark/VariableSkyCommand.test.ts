import en from "../../../src/locale/en";
import { CommandExecutionError } from "../../../src/commons/errors";
import { CloudQuantity } from "../../../src/model/enum";
import { Remark, RemarkType } from "../../../src/command/remark";
import { VariableSkyCommand } from "../../../src/command/remark/VariableSkyCommand";

describe("VariableSkyCommand", () => {
  const command = new VariableSkyCommand(en);
  const code = "SCT V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VariableSky,
          description: "cloud layer varying between scattered and broken",
          raw: code,
          cloudQuantityRange: [CloudQuantity.SCT, CloudQuantity.BKN],
        },
      ]);
    });
  });

  test("invalid 1st CloudQuantity should throw on execute", () => {
    expect(() => command.execute("RRR V BKN", [])).toThrowError(
      CommandExecutionError
    );
  });

  test("invalid 2nd CloudQuantity should throw on execute", () => {
    expect(() => command.execute("BKN V GGG", [])).toThrowError(
      CommandExecutionError
    );
  });
});
