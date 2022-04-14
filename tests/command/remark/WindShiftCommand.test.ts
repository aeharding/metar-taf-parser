import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { WindShiftCommand } from "command/remark/WindShiftCommand";

describe("WindShiftCommand", () => {
  const command = new WindShiftCommand(en);
  const code = "WSHFT 2241";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WindShift,
          description: "wind shift at 22:41",
          raw: code,
          startHour: 22,
          startMinute: 41,
        },
      ]);
    });
  });
});
