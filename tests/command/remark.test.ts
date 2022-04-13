import {
  CeilingHeightCommand,
  CeilingSecondLocationCommand,
  DefaultCommand,
  HailSizeCommand,
  HourlyMaximumMinimumTemperatureCommand,
  HourlyMaximumTemperatureCommand,
  HourlyMinimumTemperatureCommand,
  HourlyPrecipitationAmountCommand,
  HourlyPressureCommand,
  HourlyTemperatureDewPointCommand,
  IceAccretionCommand,
  ObscurationCommand,
  PrecipitationAmount24HourCommand,
  PrecipitationAmount36HourCommand,
  PrecipitationBegEndCommand,
  PrevailingVisibilityCommand,
  Remark,
  RemarkCommandSupplier,
  RemarkType,
  SeaLevelPressureCommand,
  SecondLocationVisibilityCommand,
  SectorVisibilityCommand,
  SmallHailSizeCommand,
  SnowDepthCommand,
  SnowIncreaseCommand,
  SnowPelletsCommand,
  SunshineDurationCommand,
  SurfaceVisibilityCommand,
  ThunderStormLocationCommand,
  ThunderStormLocationMovingCommand,
  TornadicActivityBegCommand,
  TornadicActivityBegEndCommand,
  TornadicActivityEndCommand,
  TowerVisibilityCommand,
  VariableSkyCommand,
  VariableSkyHeightCommand,
  VirgaDirectionCommand,
  WaterEquivalentSnowCommand,
  WindPeakCommand,
  WindShiftCommand,
  WindShiftFropaCommand,
} from "command/remark";
import en from "locale/en";
import { CloudQuantity, Phenomenon, Descriptive, Direction } from "model/enum";
import { RemarkExecutionError } from "commons/errors";

describe("CeilingHeightCommand", () => {
  const command = new CeilingHeightCommand(en);

  (() => {
    const code = "CIG 005V010";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.CeilingHeight,
            description: "ceiling varying between 500 and 1000 feet",
            raw: code,
            min: 500,
            max: 1000,
          },
        ]);
      });
    });
  })();
});

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

describe("HailSizeCommand", () => {
  const command = new HailSizeCommand(en);

  (() => {
    const code = "GR 4";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HailSize,
            description: "largest hailstones with a diameter of 4 inches",
            raw: code,
            size: "4",
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "GR 1 1/2";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HailSize,
            description: "largest hailstones with a diameter of 1 1/2 inches",
            raw: code,
            size: "1 1/2",
          },
        ]);
      });
    });
  })();
});

describe("HourlyMaximumMinimumTemperatureCommand", () => {
  const command = new HourlyMaximumMinimumTemperatureCommand(en);
  const code = "400121023";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMaximumMinimumTemperature,
          description:
            "24-hour maximum temperature of 1.2°C and 24-hour minimum temperature of -2.3°C",
          raw: code,
          max: 1.2,
          min: -2.3,
        },
      ]);
    });
  });
});

describe("HourlyMaximumTemperatureCommand", () => {
  const command = new HourlyMaximumTemperatureCommand(en);
  const code = "10272";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMaximumTemperature,
          description: "6-hourly maximum temperature of 27.2°C",
          raw: code,
          max: 27.2,
        },
      ]);
    });
  });
});

describe("HourlyMinimumTemperatureCommand", () => {
  const command = new HourlyMinimumTemperatureCommand(en);
  const code = "20283";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyMinimumTemperature,
          description: "6-hourly minimum temperature of 28.3°C",
          raw: code,
          min: 28.3,
        },
      ]);
    });
  });
});

describe("HourlyPrecipitationAmountCommand", () => {
  const command = new HourlyPrecipitationAmountCommand(en);
  const code = "P0008";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyPrecipitationAmount,
          description:
            "8/100 of an inch of precipitation fell in the last hour",
          raw: code,
          amount: 0.08,
        },
      ]);
    });
  });
});

describe("HourlyPressureCommand", () => {
  const command = new HourlyPressureCommand(en);
  const code = "52032";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.HourlyPressure,
          description:
            "steady or unsteady increase of 3.2 hectopascals in the past 3 hours",
          raw: code,
          code: 2,
          pressureChange: 3.2,
        },
      ]);
    });
  });
});

describe("HourlyTemperatureDewPointCommand", () => {
  const command = new HourlyTemperatureDewPointCommand(en);

  (() => {
    const code = "T0217";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HourlyTemperatureDewPoint,
            description: "hourly temperature of 21.7°C",
            raw: code,
            temperature: 21.7,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "T02170144";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.HourlyTemperatureDewPoint,
            description: "hourly temperature of 21.7°C and dew point of 14.4°C",
            raw: code,
            temperature: 21.7,
            dewPoint: 14.4,
          },
        ]);
      });
    });
  })();
});

describe("IceAccretionCommand", () => {
  const command = new IceAccretionCommand(en);
  const code = "l1001";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.IceAccretion,
          description:
            "1/100 of an inch of ice accretion in the past 1 hour(s)",
          raw: code,
          amount: 0.01,
          periodInHours: 1,
        },
      ]);
    });
  });
});

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
      RemarkExecutionError
    );
  });

  test("invalid Phenomenon should throw on execute", () => {
    expect(() => command.execute("FB BKN020", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("PrecipitationAmount24HourCommand", () => {
  const command = new PrecipitationAmount24HourCommand(en);
  const code = "70125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrecipitationAmount24Hour,
          description: "1.25 inches of precipitation fell in the last 24 hours",
          raw: code,
          amount: 1.25,
        },
      ]);
    });
  });
});

describe("PrecipitationAmount36HourCommand", () => {
  const command = new PrecipitationAmount36HourCommand(en);
  const code = "60225";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrecipitationAmount36Hour,
          description: "2.25 inches of precipitation fell in the last 6 hours",
          raw: code,
          periodInHours: 6,
          amount: 2.25,
        },
      ]);
    });
  });
});

describe("PrecipitationBegEndCommand", () => {
  const command = new PrecipitationBegEndCommand(en);

  (() => {
    const code = "RAB20E51";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: " rain beginning at :20 ending at :51",
            raw: code,
            phenomenon: Phenomenon.RAIN,
            startMin: 20,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "RAB0120E0151";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: " rain beginning at 01:20 ending at 01:51",
            raw: code,
            phenomenon: Phenomenon.RAIN,
            startHour: 1,
            startMin: 20,
            endHour: 1,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BLRAB0120E0151";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.PrecipitationBegEnd,
            description: "blowing rain beginning at 01:20 ending at 01:51",
            raw: code,
            descriptive: Descriptive.BLOWING,
            phenomenon: Phenomenon.RAIN,
            startHour: 1,
            startMin: 20,
            endHour: 1,
            endMin: 51,
          },
        ]);
      });
    });
  })();

  test("invalid descriptive should throw on execute", () => {
    expect(() => command.execute("BBRAB0120E0151", [])).toThrowError(
      RemarkExecutionError
    );
  });

  test("invalid phenomenon should throw on execute", () => {
    expect(() => command.execute("BLRRB0120E0151", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("PrevailingVisibilityCommand", () => {
  const command = new PrevailingVisibilityCommand(en);
  const code = "VIS 1/2V2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.PrevailingVisibility,
          description: "variable prevailing visibility between 1/2 and 2 SM",
          raw: code,
          minVisibility: "1/2",
          maxVisibility: "2",
        },
      ]);
    });
  });
});

describe("SeaLevelPressureCommand", () => {
  const command = new SeaLevelPressureCommand(en);
  const code = "SLP117";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SeaLevelPressure,
          description: "sea level pressure of 1011.7 HPa",
          raw: code,
          pressure: 1011.7,
        },
      ]);
    });
  });
});

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

describe("SectorVisibilityCommand", () => {
  const command = new SectorVisibilityCommand(en);
  const code = "VIS SW 1 1/2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SectorVisibility,
          description: "visibility of 1 1/2 SM in the South West direction",
          raw: code,
          direction: Direction.SW,
          distance: "1 1/2",
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("VIS SS 1 1/2", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("SmallHailSizeCommand", () => {
  const command = new SmallHailSizeCommand(en);
  const code = "GR LESS THAN 1/4";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SmallHailSize,
          description:
            "largest hailstones with a diameter less than 1/4 inches",
          raw: code,
          size: "1/4",
        },
      ]);
    });
  });
});

describe("SnowDepthCommand", () => {
  const command = new SnowDepthCommand(en);
  const code = "4/011";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowDepth,
          description: "snow depth of 11 inches",
          raw: code,
          depth: 11,
        },
      ]);
    });
  });
});

describe("SnowIncreaseCommand", () => {
  const command = new SnowIncreaseCommand(en);
  const code = "SNINCR 2/10";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowIncrease,
          description:
            "snow depth increase of 2 inches in the past hour with a total depth on the ground of 10 inches",
          raw: code,
          inchesLastHour: 2,
          totalDepth: 10,
        },
      ]);
    });
  });
});

describe("SnowPelletsCommand", () => {
  const command = new SnowPelletsCommand(en);
  const code = "GS HVY";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SnowPellets,
          description: "heavy snow pellets",
          raw: code,
          amount: "HVY",
        },
      ]);
    });
  });
});

describe("SunshineDurationCommand", () => {
  const command = new SunshineDurationCommand(en);
  const code = "98460";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SunshineDuration,
          description: "460 minutes of sunshine",
          raw: code,
          duration: 460,
        },
      ]);
    });
  });
});

describe("SurfaceVisibilityCommand", () => {
  const command = new SurfaceVisibilityCommand(en);
  const code = "SFC VIS 8";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.SurfaceVisibility,
          description: "surface visibility of 8 statute miles",
          raw: code,
          distance: "8",
        },
      ]);
    });
  });
});

describe("ThunderStormLocationCommand", () => {
  const command = new ThunderStormLocationCommand(en);
  const code = "TS NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.ThunderStormLocation,
          description: "thunderstorm North East of the station",
          raw: code,
          location: Direction.NE,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TS NN", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("ThunderStormLocationMovingCommand", () => {
  const command = new ThunderStormLocationMovingCommand(en);
  const code = "TS SE MOV NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.ThunderStormLocationMoving,
          description:
            "thunderstorm South East of the station moving towards North East",
          raw: code,
          location: Direction.SE,
          moving: Direction.NE,
        },
      ]);
    });
  });

  test("invalid location should throw on execute", () => {
    expect(() => command.execute("TS SS MOV NE", [])).toThrowError(
      RemarkExecutionError
    );
  });

  test("invalid moving direction should throw on execute", () => {
    expect(() => command.execute("TS SE MOV NN", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("TornadicActivityBegCommand", () => {
  const command = new TornadicActivityBegCommand(en);
  const code = "TORNADO B1112 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityBeg,
          description:
            "tornado beginning at 11:12 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          startHour: 11,
          startMinute: 12,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO B1112 4 EE", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("TornadicActivityBegEndCommand", () => {
  const command = new TornadicActivityBegEndCommand(en);
  const code = "TORNADO B1112E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityBegEnd,
          description:
            "tornado beginning at 11:12 ending at 12:34 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          startHour: 11,
          startMinute: 12,
          endHour: 12,
          endMinute: 34,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO B1112E1234 4 WW", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("TornadicActivityEndCommand", () => {
  const command = new TornadicActivityEndCommand(en);
  const code = "TORNADO E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TornadicActivityEnd,
          description: "tornado ending at 12:34 4 SM South West of the station",
          raw: code,
          tornadicType: "TORNADO",
          endHour: 12,
          endMinute: 34,
          distance: 4,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("TORNADO E1234 4 NS", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("TowerVisibilityCommand", () => {
  const command = new TowerVisibilityCommand(en);
  const code = "TWR VIS 3";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.TowerVisibility,
          description: "control tower visibility of 3 statute miles",
          raw: code,
          distance: "3",
        },
      ]);
    });
  });
});

describe("VariableSkyCommand", () => {
  const command = new VariableSkyCommand(en);
  const code = "SCT V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VariableSky,
          description: "cloud layer varying between scattered and broken",
          raw: code,
          cloudQuantityRange: [CloudQuantity.SCT, CloudQuantity.BKN],
        },
      ]);
    });
  });

  test("invalid 1st CloudQuantity should throw on execute", () => {
    expect(() => command.execute("RRR V BKN", [])).toThrowError(
      RemarkExecutionError
    );
  });

  test("invalid 2nd CloudQuantity should throw on execute", () => {
    expect(() => command.execute("BKN V GGG", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("VariableSkyHeightCommand", () => {
  const command = new VariableSkyHeightCommand(en);
  const code = "SCT008 V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VariableSkyHeight,
          description:
            "cloud layer at 800 feet varying between scattered and broken",
          raw: code,
          height: 800,
          cloudQuantityRange: [CloudQuantity.SCT, CloudQuantity.BKN],
        },
      ]);
    });
  });

  test("invalid 1st CloudQuantity should throw on execute", () => {
    expect(() => command.execute("RRR008 V BKN", [])).toThrowError(
      RemarkExecutionError
    );
  });

  test("invalid 2nd CloudQuantity should throw on execute", () => {
    expect(() => command.execute("BKN008 V GGG", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("VirgaDirectionCommand", () => {
  const command = new VirgaDirectionCommand(en);
  const code = "VIRGA SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.VirgaDirection,
          description: "virga South West from the station",
          raw: code,
          direction: Direction.SW,
        },
      ]);
    });
  });

  test("invalid direction should throw on execute", () => {
    expect(() => command.execute("VIRGA WE", [])).toThrowError(
      RemarkExecutionError
    );
  });
});

describe("WaterEquivalentSnowCommand", () => {
  const command = new WaterEquivalentSnowCommand(en);
  const code = "933125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WaterEquivalentSnow,
          description: "water equivalent of 12.5 inches of snow",
          raw: code,
          amount: 12.5,
        },
      ]);
    });
  });
});

describe("WindPeakCommand", () => {
  const command = new WindPeakCommand(en);
  const code = "PK WND 29027/2250";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual<Remark[]>([
        {
          type: RemarkType.WindPeak,
          description: "peak wind of 27 knots from 290 degrees at 22:50",
          raw: code,
          speed: 27,
          degrees: 290,
          startHour: 22,
          startMinute: 50,
        },
      ]);
    });
  });
});

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

describe("DefaultCommand", () => {
  const command = new DefaultCommand(en);

  (() => {
    const code = "AO1";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.AO1,
            description:
              "automated stations without a precipitation discriminator",
            raw: code,
          },
        ]);
      });
    });
  })();

  (() => {
    const code = "BOGUS";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual<Remark[]>([
          {
            type: RemarkType.Unknown,
            raw: "BOGUS",
          },
        ]);
      });
    });
  })();
});

describe("RemarkCommandSupplier", () => {
  const supplier = new RemarkCommandSupplier(en);

  test("gets WindShiftFropaCommand command", () => {
    const code = "WSHFT 2241 FROPA";

    expect(supplier.get(code)).toBeInstanceOf(WindShiftFropaCommand);
  });

  test("returns DefaultCommand if unknown", () => {
    const code = "bogus";

    expect(supplier.get(code)).toBeInstanceOf(DefaultCommand);
  });
});
