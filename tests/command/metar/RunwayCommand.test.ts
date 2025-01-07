import { RunwayCommand } from "command/metar/RunwayCommand";
import { IMetar } from "model/model";
import {
  DepositCoverage,
  DepositType,
  RunwayInfoTrend,
  RunwayInfoUnit,
  ValueIndicator,
} from "model/enum";

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
        expect(metar.runwaysInfo[0]).toEqual({
          name: "26",
          minRange: 600,
          trend: RunwayInfoTrend.Uprising,
          unit: RunwayInfoUnit.Meters,
        });
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
    const code = "R08L/1400V1800FT/N"; // runway info range north america style
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "08L",
          minRange: 1400,
          maxRange: 1800,
          unit: RunwayInfoUnit.Feet,
          trend: RunwayInfoTrend.NoSignificantChange,
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
    const code = "R05/629294"; // runway deposit
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "05",
          depositType: DepositType.Slush,
          coverage: DepositCoverage.From11To25,
          thickness: "92",
          brakingCapacity: "94",
        });
      });
    });
  })();
  (() => {
    const code = "R05//29294"; // runway deposit with not reported type
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "05",
          depositType: DepositType.NotReported,
          coverage: DepositCoverage.From11To25,
          thickness: "92",
          brakingCapacity: "94",
        });
      });
    });
  })();
  (() => {
    const code = "R05/6292/4"; // runway deposit with invalid deposit
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

  (() => {
    const code = "R36/4000FT/D"; // runway info north america style
    const metar = { runwaysInfo: [] } as unknown as IMetar;

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("parse", () => {
        command.execute(metar, code);

        expect(metar.runwaysInfo).toHaveLength(1);
        expect(metar.runwaysInfo[0]).toEqual({
          name: "36",
          minRange: 4000,
          unit: RunwayInfoUnit.Feet,
          trend: RunwayInfoTrend.Decreasing,
        });
      });
    });
  })();
});
