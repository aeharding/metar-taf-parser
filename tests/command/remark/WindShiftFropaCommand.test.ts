import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { WindShiftFropaCommand } from "../../../src/command/remark/WindShiftFropaCommand";

describe("WindShiftFropaCommand", () => {
  const command = new WindShiftFropaCommand(en);
  const code = "WSHFT 2241 FROPA";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WindShiftFropa,
          description: "wind shift accompanied by frontal passage at 22:41",
          raw: code,
          startHour: 22,
          startMinute: 41,
        },
      ]);
    });
  });
});
