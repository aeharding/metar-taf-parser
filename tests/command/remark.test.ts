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
  RemarkCommandSupplier,
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
} from "../../lib/command/remark";

describe("CeilingHeightCommand", () => {
  const command = new CeilingHeightCommand();

  (() => {
    const code = "CIG 005V010";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual(["ceiling varying between 500 and 1000 feet"]);
      });
    });
  })();
});

describe("CeilingSecondLocationCommand", () => {
  const command = new CeilingSecondLocationCommand();

  (() => {
    const code = "CIG 002 RY11";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual([
          "ceiling of 200 feet mesured by a second sensor located at RY11",
        ]);
      });
    });
  })();
});

describe("HailSizeCommand", () => {
  const command = new HailSizeCommand();

  (() => {
    const code = "GR 4";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual([
          "largest hailstones with a diameter of 4 inches",
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
        expect(remarks).toEqual([
          "largest hailstones with a diameter of 1 1/2 inches",
        ]);
      });
    });
  })();
});

describe("HourlyMaximumMinimumTemperatureCommand", () => {
  const command = new HourlyMaximumMinimumTemperatureCommand();
  const code = "400121023";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "24-hour maximum temperature of 1.2°C and 24-hour minimum temperature of -2.3°C",
      ]);
    });
  });
});

describe("HourlyMaximumTemperatureCommand", () => {
  const command = new HourlyMaximumTemperatureCommand();
  const code = "10272";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["6-hourly maximum temperature of 27.2°C"]);
    });
  });
});

describe("HourlyMinimumTemperatureCommand", () => {
  const command = new HourlyMinimumTemperatureCommand();
  const code = "20283";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["6-hourly minimum temperature of 28.3°C"]);
    });
  });
});

describe("HourlyPrecipitationAmountCommand", () => {
  const command = new HourlyPrecipitationAmountCommand();
  const code = "P0008";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "8/100 of an inch of precipitation fell in the last hour",
      ]);
    });
  });
});

describe("HourlyPressureCommand", () => {
  const command = new HourlyPressureCommand();
  const code = "52032";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "steady or unsteady increase of 2 hectopascals in the past 3 hours",
      ]);
    });
  });
});

describe("HourlyTemperatureDewPointCommand", () => {
  const command = new HourlyTemperatureDewPointCommand();

  (() => {
    const code = "T0217";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual(["hourly temperature of 21.7°C"]);
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
        expect(remarks).toEqual([
          "hourly temperature of 21.7°C and dew point of 14.4°C",
        ]);
      });
    });
  })();
});

describe("IceAccretionCommand", () => {
  const command = new IceAccretionCommand();
  const code = "l1001";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "1/100 of an inch of ice accretion in the past 1 hour(s)",
      ]);
    });
  });
});

describe("ObscurationCommand", () => {
  const command = new ObscurationCommand();
  const code = "FU BKN020";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["broken layer at 2000 feet composed of smoke"]);
    });
  });
});

describe("PrecipitationAmount24HourCommand", () => {
  const command = new PrecipitationAmount24HourCommand();
  const code = "70125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "1.25 inches of precipitation fell in the last 24 hours",
      ]);
    });
  });
});

describe("PrecipitationAmount36HourCommand", () => {
  const command = new PrecipitationAmount36HourCommand();
  const code = "60225";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "2.25 inches of precipitation fell in the last 6 hours",
      ]);
    });
  });
});

describe("PrecipitationBegEndCommand", () => {
  const command = new PrecipitationBegEndCommand();

  (() => {
    const code = "RAB20E51";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse(code)).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual([" rain beginning at :20 ending at :51"]);
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
        expect(remarks).toEqual([" rain beginning at 01:20 ending at 01:51"]);
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
        expect(remarks).toEqual([
          "blowing rain beginning at 01:20 ending at 01:51",
        ]);
      });
    });
  })();
});

describe("PrevailingVisibilityCommand", () => {
  const command = new PrevailingVisibilityCommand();
  const code = "VIS 1/2V2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "variable prevailing visibility between 1/2 and 2 SM",
      ]);
    });
  });
});

describe("SeaLevelPressureCommand", () => {
  const command = new SeaLevelPressureCommand();
  const code = "SLP117";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["sea level pressure of 1011.7 HPa"]);
    });
  });
});

describe("SecondLocationVisibilityCommand", () => {
  const command = new SecondLocationVisibilityCommand();
  const code = "VIS 1/2 RWY12";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "visibility of 1/2 SM mesured by a second sensor located at RWY12",
      ]);
    });
  });
});

describe("SectorVisibilityCommand", () => {
  const command = new SectorVisibilityCommand();
  const code = "VIS SW 1 1/2";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "visibility of 1 1/2 SM in the South West direction",
      ]);
    });
  });
});

describe("SmallHailSizeCommand", () => {
  const command = new SmallHailSizeCommand();
  const code = "GR LESS THAN 1/4";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "largest hailstones with a diameter less than 1/4 inches",
      ]);
    });
  });
});

describe("SnowDepthCommand", () => {
  const command = new SnowDepthCommand();
  const code = "4/011";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["snow depth of 11 inches"]);
    });
  });
});

describe("SnowIncreaseCommand", () => {
  const command = new SnowIncreaseCommand();
  const code = "SNINCR 2/10";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "snow depth increase of 2 inches in the past hour with a total depth on the ground of 10 inches",
      ]);
    });
  });
});

describe("SnowPelletsCommand", () => {
  const command = new SnowPelletsCommand();
  const code = "GS HVY";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["heavy snow pellets"]);
    });
  });
});

describe("SunshineDurationCommand", () => {
  const command = new SunshineDurationCommand();
  const code = "98460";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["460 minutes of sunshine"]);
    });
  });
});

describe("SurfaceVisibilityCommand", () => {
  const command = new SurfaceVisibilityCommand();
  const code = "SFC VIS 8";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["surface visibility of 8 statute miles"]);
    });
  });
});

describe("ThunderStormLocationCommand", () => {
  const command = new ThunderStormLocationCommand();
  const code = "TS NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["thunderstorm North East of the station"]);
    });
  });
});

describe("ThunderStormLocationMovingCommand", () => {
  const command = new ThunderStormLocationMovingCommand();
  const code = "TS SE MOV NE";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "thunderstorm South East of the station moving towards North East",
      ]);
    });
  });
});

describe("TornadicActivityBegCommand", () => {
  const command = new TornadicActivityBegCommand();
  const code = "TORNADO B1112 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "tornado beginning at 11:12 4 SM South West of the station",
      ]);
    });
  });
});

describe("TornadicActivityBegEndCommand", () => {
  const command = new TornadicActivityBegEndCommand();
  const code = "TORNADO B1112E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "tornado beginning at 11:12 ending at 12:34 4 SM South West of the station",
      ]);
    });
  });
});

describe("TornadicActivityEndCommand", () => {
  const command = new TornadicActivityEndCommand();
  const code = "TORNADO E1234 4 SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "tornado ending at 12:34 4 SM South West of the station",
      ]);
    });
  });
});

describe("TowerVisibilityCommand", () => {
  const command = new TowerVisibilityCommand();
  const code = "TWR VIS 3";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["control tower visibility of 3 statute miles"]);
    });
  });
});

describe("VariableSkyCommand", () => {
  const command = new VariableSkyCommand();
  const code = "SCT V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "cloud layer varying between scattered and broken",
      ]);
    });
  });
});

describe("VariableSkyHeightCommand", () => {
  const command = new VariableSkyHeightCommand();
  const code = "SCT008 V BKN";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "cloud layer at 800 feet varying between scattered and broken",
      ]);
    });
  });
});

describe("VirgaDirectionCommand", () => {
  const command = new VirgaDirectionCommand();
  const code = "VIRGA SW";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["virga South West from the station"]);
    });
  });
});

describe("WaterEquivalentSnowCommand", () => {
  const command = new WaterEquivalentSnowCommand();
  const code = "933125";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["water equivalent of 12.5 inches of snow"]);
    });
  });
});

describe("WindPeakCommand", () => {
  const command = new WindPeakCommand();
  const code = "PK WND 29027/2250";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "peak wind of 27 knots from 290 degrees at 22:50",
      ]);
    });
  });
});

describe("WindShiftCommand", () => {
  const command = new WindShiftCommand();
  const code = "WSHFT 2241";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual(["wind shift at 22:41"]);
    });
  });
});

describe("WindShiftFropaCommand", () => {
  const command = new WindShiftFropaCommand();
  const code = "WSHFT 2241 FROPA";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "wind shift accompanied by frontal passage at 22:41",
      ]);
    });
  });
});

describe("WindShiftFropaCommand", () => {
  const command = new WindShiftFropaCommand();
  const code = "WSHFT 2241 FROPA";

  describe(code, () => {
    test("canParse", () => {
      expect(command.canParse(code)).toBe(true);
    });

    test("execute", () => {
      const [res, remarks] = command.execute(code, []);

      expect(res).toBe("");
      expect(remarks).toEqual([
        "wind shift accompanied by frontal passage at 22:41",
      ]);
    });
  });
});

describe("DefaultCommand", () => {
  const command = new DefaultCommand();

  (() => {
    const code = "AO1";

    describe(code, () => {
      test("canParse", () => {
        expect(command.canParse()).toBe(true);
      });

      test("execute", () => {
        const [res, remarks] = command.execute(code, []);

        expect(res).toBe("");
        expect(remarks).toEqual([
          "automated stations without a precipitation discriminator",
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
        expect(remarks).toEqual(["BOGUS"]);
      });
    });
  })();
});

describe("RemarkCommandSupplier", () => {
  const supplier = new RemarkCommandSupplier();

  test("gets WindShiftFropaCommand command", () => {
    const code = "WSHFT 2241 FROPA";

    expect(supplier.get(code)).toBeInstanceOf(WindShiftFropaCommand);
  });

  test("returns DefaultCommand if unknown", () => {
    const code = "bogus";

    expect(supplier.get(code)).toBeInstanceOf(DefaultCommand);
  });
});
