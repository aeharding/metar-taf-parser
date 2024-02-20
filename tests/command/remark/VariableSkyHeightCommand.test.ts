import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { CloudQuantity } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { VariableSkyHeightCommand } from "command/remark/VariableSkyHeightCommand";

describe("VariableSkyHeightCommand", () => {
  const command = new VariableSkyHeightCommand(en);
  const code = "SCT008 V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VariableSkyHeight,
          description:
            "cloud layer at 800 feet varying between scattered and broken",
          raw: code,
          height: 800,
          cloudQuantityRange: [CloudQuantity.SCT, CloudQuantity.BKN],
        },
      ]);
    });
  });

  test("invalid 1st CloudQuantity should throw on execute", () => {
    expect(() => command.execute("RRR008 V BKN", [])).toThrowError(
      CommandExecutionError,
    );
  });

  test("invalid 2nd CloudQuantity should throw on execute", () => {
    expect(() => command.execute("BKN008 V GGG", [])).toThrowError(
      CommandExecutionError,
    );
  });
});
