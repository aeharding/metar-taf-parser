import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { SecondLocationVisibilityCommand } from "command/remark/SecondLocationVisibilityCommand";

describe("SecondLocationVisibilityCommand", () => {
  const command = new SecondLocationVisibilityCommand(en);
  const code = "VIS 1/2 RWY12";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SecondLocationVisibility,
          description:
            "visibility of 1/2 SM mesured by a second sensor located at RWY12",
          raw: code,
          distance: "1/2",
          location: "RWY12",
        },
      ]);
    });
  });
});
