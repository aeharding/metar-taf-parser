import en from "../../../src/locale/en";
import { CommandExecutionError } from "../../../src/commons/errors";
import { Direction } from "../../../src/model/enum";
import { Remark, RemarkType } from "../../../src/command/remark";
import { VirgaDirectionCommand } from "../../../src/command/remark/VirgaDirectionCommand";

describe("VirgaDirectionCommand", () => {
  const command = new VirgaDirectionCommand(en);
  const code = "VIRGA SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VirgaDirection,
          description: "virga South West from the station",
          raw: code,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("VIRGA WE", [])).toThrowError(
      CommandExecutionError
    );
  });
});
