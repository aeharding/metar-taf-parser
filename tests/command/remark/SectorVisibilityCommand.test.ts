import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { Direction } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { SectorVisibilityCommand } from "command/remark/SectorVisibilityCommand";

describe("SectorVisibilityCommand", () => {
  const command = new SectorVisibilityCommand(en);
  const code = "VIS SW 1 1/2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SectorVisibility,
          description: "visibility of 1 1/2 SM in the South West direction",
          raw: code,
          direction: Direction.SW,
          distance: "1 1/2",
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("VIS SS 1 1/2", [])).toThrowError(
      CommandExecutionError
    );
  });
});
