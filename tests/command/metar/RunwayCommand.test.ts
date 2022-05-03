import { RunwayCommand } from "../../../src/command/metar/RunwayCommand";
import { IMetar } from "../../../src/model/model";
import {
  RunwayInfoTrend,
  RunwayInfoUnit,
  ValueIndicator,
} from "../../../src/model/enum";

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
        expect(metar.runwaysInfo[0]).toEqual({
          name: "26L",
          minRange: 550,
          maxRange: 700,
          trend: RunwayInfoTrend.Uprising,
          unit: RunwayInfoUnit.Meters,
        });
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

  (() => {
    const code = "R01L/0600V1000FT"; // runway info range feet variable
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "01L",
          minRange: 600,
          maxRange: 1000,
          unit: RunwayInfoUnit.Feet,
        });
      });
    });
  })();

  (() => {
    const code = "R01L/0800FT"; // runway info range feet simple
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "01L",
          minRange: 800,
          unit: RunwayInfoUnit.Feet,
        });
      });
    });
  })();

  (() => {
    const code = "R01L/P0600FT"; // runway info with greater than indicator
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "01L",
          minRange: 600,
          unit: RunwayInfoUnit.Feet,
          indicator: ValueIndicator.GreaterThan,
        });
      });
    });
  })();
});
