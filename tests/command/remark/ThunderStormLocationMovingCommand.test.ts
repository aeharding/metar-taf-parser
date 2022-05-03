import en from "../../../src/locale/en";
import { CommandExecutionError } from "../../../src/commons/errors";
import { Direction } from "../../../src/model/enum";
import { Remark, RemarkType } from "../../../src/command/remark";
import { ThunderStormLocationMovingCommand } from "../../../src/command/remark/ThunderStormLocationMovingCommand";

describe("ThunderStormLocationMovingCommand", () => {
  const command = new ThunderStormLocationMovingCommand(en);
  const code = "TS SE MOV NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.ThunderStormLocationMoving,
          description:
            "thunderstorm South East of the station moving towards North East",
          raw: code,
          location: Direction.SE,
          moving: Direction.NE,
        },
      ]);
    });
  });

  test("invalid location should throw on execute", () => {
    expect(() => command.execute("TS SS MOV NE", [])).toThrowError(
      CommandExecutionError
    );
  });

  test("invalid moving direction should throw on execute", () => {
    expect(() => command.execute("TS SE MOV NN", [])).toThrowError(
      CommandExecutionError
    );
  });
});
