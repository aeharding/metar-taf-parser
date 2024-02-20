import en from "locale/en";
import { CommandExecutionError } from "commons/errors";
import { CloudQuantity, Phenomenon } from "model/enum";
import { Remark, RemarkType } from "command/remark";
import { ObscurationCommand } from "command/remark/ObscurationCommand";

describe("ObscurationCommand", () => {
  const command = new ObscurationCommand(en);

  (() => {
    const code = "FU BKN020";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.Obscuration,
            description: "broken layer at 2000 feet composed of smoke",
            raw: code,
            quantity: CloudQuantity.BKN,
            height: 2000,
            phenomenon: Phenomenon.SMOKE,
          },
        ]);
      });
    });
  })();

  test("invalid CloudQuantity should throw on execute", () => {
    expect(() => command.execute("FU BKG020", [])).toThrowError(
      CommandExecutionError,
    );
  });

  test("invalid Phenomenon should throw on execute", () => {
    expect(() => command.execute("FB BKN020", [])).toThrowError(
      CommandExecutionError,
    );
  });
});
