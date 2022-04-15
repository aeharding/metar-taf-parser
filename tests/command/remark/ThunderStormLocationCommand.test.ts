import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { Direction } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { ThunderStormLocationCommand } from "command/remark/ThunderStormLocationCommand";

describe("ThunderStormLocationCommand", () => {
  const command = new ThunderStormLocationCommand(en);
  const code = "TS NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.ThunderStormLocation,
          description: "thunderstorm North East of the station",
          raw: code,
          location: Direction.NE,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TS NN", [])).toThrowError(
      CommandExecutionError
    );
  });
});
