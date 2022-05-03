import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { Direction } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { TornadicActivityBegCommand } from "command/remark/TornadicActivityBegCommand";

describe("TornadicActivityBegCommand", () => {
  const command = new TornadicActivityBegCommand(en);
  const code = "TORNADO B1112 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityBeg,
          description:
            "tornado beginning at 11:12 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          startHour: 11,
          startMinute: 12,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO B1112 4 EE", [])).toThrowError(
      CommandExecutionError
    );
  });
});
