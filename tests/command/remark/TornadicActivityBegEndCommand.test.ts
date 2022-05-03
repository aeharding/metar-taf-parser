import en from "../../../src/locale/en";
import { CommandExecutionError } from "../../../src/commons/errors";
import { Direction } from "../../../src/model/enum";
import { Remark, RemarkType } from "../../../src/command/remark";
import { TornadicActivityBegEndCommand } from "../../../src/command/remark/TornadicActivityBegEndCommand";

describe("TornadicActivityBegEndCommand", () => {
  const command = new TornadicActivityBegEndCommand(en);
  const code = "TORNADO B1112E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityBegEnd,
          description:
            "tornado beginning at 11:12 ending at 12:34 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          startHour: 11,
          startMinute: 12,
          endHour: 12,
          endMinute: 34,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO B1112E1234 4 WW", [])).toThrowError(
      CommandExecutionError
    );
  });
});
