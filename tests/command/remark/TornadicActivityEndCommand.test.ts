import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { Direction } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { TornadicActivityEndCommand } from "command/remark/TornadicActivityEndCommand";

describe("TornadicActivityEndCommand", () => {
  const command = new TornadicActivityEndCommand(en);
  const code = "TORNADO E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityEnd,
          description: "tornado ending at 12:34 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          endHour: 12,
          endMinute: 34,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO E1234 4 NS", [])).toThrowError(
      CommandExecutionError,
    );
  });
});
