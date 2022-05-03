import en from "../../../src/locale/en";
import { Remark, RemarkType } from "../../../src/command/remark";
import { CeilingSecondLocationCommand } from "../../../src/command/remark/CeilingSecondLocationCommand";

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
              "ceiling of 200 feet mesured by a second sensor located at RY11",
            raw: code,
            height: 200,
            location: "RY11",
          },
        ]);
      });
    });
  })();
});
