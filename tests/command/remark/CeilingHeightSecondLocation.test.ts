import en from "locale/en";
import { Remark, RemarkType } from "command/remark";
import { CeilingSecondLocationCommand } from "command/remark/CeilingSecondLocationCommand";

describe("CeilingSecondLocationCommand", () => {
  const command = new CeilingSecondLocationCommand(en);

  (() => {
    const code = "CIG 002 RY11";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.CeilingSecondLocation,
            description:
              "ceiling of 200 feet measured by a second sensor located at RY11",
            raw: code,
            height: 200,
            location: "RY11",
          },
        ]);
      });
    });
  })();
});
