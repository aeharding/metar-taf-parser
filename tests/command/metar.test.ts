import { RunwayCommand } from "command/metar";
import { IMetar } from "model/model";

describe("RunwayCommand", () => {
  const command = new RunwayCommand();

  (() => {
    const code = "R26/0600U";
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0].name).toBe("26");
        expect(metar.runwaysInfo[0].minRange).toBe(600);
        expect(metar.runwaysInfo[0].trend).toBe("U");
      });
    });
  })();

  (() => {
    const code = "R26L/0550V700U";
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0].name).toBe("26L");
        expect(metar.runwaysInfo[0].minRange).toBe(550);
        expect(metar.runwaysInfo[0].maxRange).toBe(700);
        expect(metar.runwaysInfo[0].trend).toBe("U");
      });
    });
  })();

  (() => {
    const code = "R26R/AZEAZEDS"; // wrong runway
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(0);
      });
    });
  })();
});
