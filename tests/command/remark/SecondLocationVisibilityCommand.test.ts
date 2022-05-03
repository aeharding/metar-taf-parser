import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { SecondLocationVisibilityCommand } from "../../../src/command/remark/SecondLocationVisibilityCommand";

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
          distance: 0.5,
          location: "RWY12",
        },
      ]);
    });
  });
});
