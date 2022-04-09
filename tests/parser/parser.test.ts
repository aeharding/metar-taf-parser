import {
  AbstractParser,
  MetarParser,
  parseTemperature,
  parseValidity,
  RemarkParser,
} from "parser/parser";
import i18n from "commons/i18n";
import {
  CloudQuantity,
  CloudType,
  Descriptive,
  Intensity,
  Phenomenon,
  TimeIndicator,
  WeatherChangeType,
} from "model/enum";
import { IAbstractWeatherContainer } from "model/model";

describe("RemarkParser", () => {
  (() => {
    const code = "Token AO1 End of remark";

    test(`parses "${code}"`, () => {
      const remarks = new RemarkParser().parse(code);

      expect(remarks).toStrictEqual([
        "Token",
        i18n.Remark.AO1,
        "End",
        "of",
        "remark",
      ]);
    });
  })();
});

class StubParser extends AbstractParser {}

describe("RemarkParser", () => {
  (() => {
    const code = "-DZ";

    test(`parses "${code}"`, () => {
      const weatherCondition = new StubParser().parseWeatherCondition(code);

      expect(weatherCondition.intensity).toBe(Intensity.LIGHT);
      expect(weatherCondition.phenomenons).toHaveLength(1);
      expect(weatherCondition.phenomenons[0]).toBe(Phenomenon.DRIZZLE);
    });
  })();

  (() => {
    const code = "SHRAGR";

    test(`parses "${code}"`, () => {
      const weatherCondition = new StubParser().parseWeatherCondition(code);

      expect(weatherCondition.intensity).toBeUndefined();
      expect(weatherCondition.descriptive).toBe(Descriptive.SHOWERS);
      expect(weatherCondition.phenomenons).toEqual([
        Phenomenon.RAIN,
        Phenomenon.HAIL,
      ]);
    });
  })();

  test("tokenize", () => {
    const code =
      "METAR KTTN 051853Z 04011KT 1 1/2SM VCTS SN FZFG BKN003 OVC010 M02/M02 A3006 RMK AO2 TSB40 SLP176 P0002 T10171017=";
    const expected = [
      "METAR",
      "KTTN",
      "051853Z",
      "04011KT",
      "1 1/2SM",
      "VCTS",
      "SN",
      "FZFG",
      "BKN003",
      "OVC010",
      "M02/M02",
      "A3006",
      "RMK",
      "AO2",
      "TSB40",
      "SLP176",
      "P0002",
      "T10171017",
    ];

    const res = new StubParser().tokenize(code);

    expect(res).toEqual(expected);
  });

  const values: [string, unknown][] = [
    ["05009KT", true],
    ["030V113", true],
    ["9999", true],
    ["6 1/2SM", true],
    ["1100w", true],
    ["VV002", true],
    ["CAVOK", true],
    ["SCT026CB", true],
    ["ZZZ026CV", false],
    ["+SHGSRA", true],
    ["+VFDR", false],
  ];

  values.forEach(([input, expected]) => {
    test(input, () => {
      expect(
        new StubParser().generalParse(
          {
            weatherConditions: [],
            visibility: {},
            wind: {},
            clouds: [],
          } as unknown as IAbstractWeatherContainer,
          input
        )
      ).toBe(expected);
    });
  });
});

describe("MetarParser", () => {
  test("parses", () => {
    const input =
      "LFPG 170830Z 00000KT 0350 R27L/0375N R09R/0175N R26R/0500D R08L/0400N R26L/0275D R08R/0250N R27R/0300N R09L/0200N FG SCT000 M01/M01 Q1026 NOSIG";

    const metar = new MetarParser().parse(input);

    expect(metar.station).toBe("LFPG");
    expect(metar.day).toBe(17);
    expect(metar.hour).toBe(8);
    expect(metar.minute).toBe(30);
    expect(metar.wind).toBeDefined();
    expect(metar.wind?.speed).toBe(0);
    expect(metar.wind?.direction).toBe("N");
    expect(metar.wind?.unit).toBe("KT");
    expect(metar.visibility).toBeDefined();
    expect(metar.visibility?.distance).toBe("350m");
    expect(metar.runwaysInfo).toHaveLength(8);
    expect(metar.runwaysInfo[0].name).toBe("27L");
    expect(metar.runwaysInfo[0].minRange).toBe(375);
    expect(metar.runwaysInfo[0].trend).toBe("N");
  });

  describe("MetarParser", () => {
    test("tempo", () => {
      const input =
        "LFBG 081130Z AUTO 23012KT 9999 SCT022 BKN072 BKN090 22/16 Q1011 TEMPO 26015G25KT 3000 TSRA SCT025CB BKN050";

      const metar = new MetarParser().parse(input);

      expect(metar.auto).toBe(true);
      expect(metar.clouds).toHaveLength(3);
      expect(metar.trends).toHaveLength(1);

      const trend = metar.trends[0];

      expect(trend.type).toBe(WeatherChangeType.TEMPO);
      expect(trend.wind).toBeDefined();
      expect(trend.wind.degrees).toBe(260);
      expect(trend.wind.speed).toBe(15);
      expect(trend.wind.gust).toBe(25);
      expect(trend.times).toHaveLength(0);
      expect(trend.visibility?.distance).toBe("3000m");
      expect(trend.weatherConditions).toHaveLength(1);

      const wc = trend.weatherConditions[0];

      expect(wc.phenomenons[0]).toBe(Phenomenon.RAIN);
      expect(trend.clouds).toHaveLength(2);
      expect(trend.clouds[0].quantity).toBe(CloudQuantity.SCT);
      expect(trend.clouds[0].height).toBe(2500);
      expect(trend.clouds[0].type).toBe(CloudType.CB);
      expect(trend.clouds[1].quantity).toBe(CloudQuantity.BKN);
      expect(trend.clouds[1].height).toBe(5000);
      expect(trend.clouds[1].type).toBeUndefined();
    });

    test("tempo becmg", () => {
      const metar = new MetarParser().parse(
        "LFRM 081630Z AUTO 30007KT 260V360 9999 24/15 Q1008 TEMPO SHRA BECMG SKC"
      );

      expect(metar.trends).toHaveLength(2);
      expect(metar.trends[0].type).toBe(WeatherChangeType.TEMPO);
      expect(metar.trends[0].weatherConditions).toHaveLength(1);
      expect(metar.trends[0].weatherConditions[0].descriptive).toBe(
        Descriptive.SHOWERS
      );
      expect(metar.trends[0].weatherConditions[0].phenomenons[0]).toBe(
        Phenomenon.RAIN
      );
      expect(metar.trends[1].type).toBe(WeatherChangeType.BECMG);
      expect(metar.trends[1].clouds).toHaveLength(1);
    });

    test("tempo fm", () => {
      const metar = new MetarParser().parse(
        "LFRM 081630Z AUTO 30007KT 260V360 9999 24/15 Q1008 TEMPO FM1830 SHRA"
      );

      expect(metar.trends).toHaveLength(1);
      expect(metar.trends[0].type).toBe(WeatherChangeType.TEMPO);
      expect(metar.trends[0].weatherConditions).toHaveLength(1);

      const trend = metar.trends[0];

      expect(trend.weatherConditions[0].descriptive).toBe(Descriptive.SHOWERS);
      expect(trend.weatherConditions[0].phenomenons).toHaveLength(1);
      expect(trend.times[0].type).toBe(TimeIndicator.FM);
      expect(trend.times[0].hour).toBe(18);
      expect(trend.times[0].minute).toBe(30);
    });

    test("tempo tl", () => {
      const metar = new MetarParser().parse(
        "LFRM 081630Z AUTO 30007KT 260V360 9999 24/15 Q1008 TEMPO FM1700 TL1830 SHRA"
      );

      expect(metar.trends).toHaveLength(1);
      expect(metar.trends[0].type).toBe(WeatherChangeType.TEMPO);
      expect(metar.trends[0].weatherConditions).toHaveLength(1);

      const trend = metar.trends[0];

      expect(trend.weatherConditions[0].descriptive).toBe(Descriptive.SHOWERS);
      expect(trend.weatherConditions[0].phenomenons).toHaveLength(1);
      expect(trend.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.RAIN);
      expect(trend.times[0].type).toBe(TimeIndicator.FM);
      expect(trend.times[0].hour).toBe(17);
      expect(trend.times[0].minute).toBe(0);
      expect(trend.times[1].type).toBe(TimeIndicator.TL);
      expect(trend.times[1].hour).toBe(18);
      expect(trend.times[1].minute).toBe(30);
      expect(metar.visibility?.distance).toBe("> 10km");
    });

    test("minVisibility", () => {
      const metar = new MetarParser().parse(
        "LFPG 161430Z 24015G25KT 5000 1100w"
      );

      expect(metar.day).toBe(16);
      expect(metar.hour).toBe(14);
      expect(metar.minute).toBe(30);
      expect(metar.wind.degrees).toBe(240);
      expect(metar.wind.speed).toBe(15);
      expect(metar.wind.gust).toBe(25);
      expect(metar.visibility?.distance).toBe("5000m");
      expect(metar.visibility?.minDistance).toBe(1100);
      expect(metar.visibility?.minDirection).toBe("w");
    });

    test("wind variation", () => {
      const metar = new MetarParser().parse("LFPG 161430Z 24015G25KT 180V300");

      expect(metar.wind.degrees).toBe(240);
      expect(metar.wind.speed).toBe(15);
      expect(metar.wind.gust).toBe(25);
      expect(metar.wind.unit).toBe("KT");
      expect(metar.wind.minVariation).toBe(180);
      expect(metar.wind.maxVariation).toBe(300);
    });

    test("vertical visibility", () => {
      const metar = new MetarParser().parse(
        "LFLL 160730Z 28002KT 0350 FG VV002"
      );

      expect(metar.day).toBe(16);
      expect(metar.hour).toBe(7);
      expect(metar.minute).toBe(30);
      expect(metar.wind.degrees).toBe(280);
      expect(metar.visibility?.distance).toBe("350m");
      expect(metar.verticalVisibility).toBe(200);
      expect(metar.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    });

    test("Ndv", () => {
      const metar = new MetarParser().parse(
        "LSZL 300320Z AUTO 00000KT 9999NDV BKN060 OVC074 00/M04 Q1001\n RMK="
      );

      expect(metar.visibility?.distance).toBe("> 10km");
    });

    test("cavok", () => {
      const metar = new MetarParser().parse(
        "LFPG 212030Z 03003KT CAVOK 09/06 Q1031 NOSIG"
      );

      expect(metar.cavok).toBe(true);
      expect(metar.visibility?.distance).toBe("> 10km");
      expect(metar.temperature).toBe(9);
      expect(metar.dewPoint).toBe(6);
      expect(metar.altimeter).toBe(1031);
      expect(metar.nosig).toBe(true);
    });

    test("altimeter mercury", () => {
      const metar = new MetarParser().parse(
        "KTTN 051853Z 04011KT 9999 VCTS SN FZFG BKN003 OVC010 M02/M02 A3006"
      );

      expect(metar.altimeter).toBe(1017);
      expect(metar.weatherConditions).toHaveLength(3);
    });

    test("wind alternative form", () => {
      const metar = new MetarParser().parse(
        "ENLK 081350Z 26026G40 240V300 9999 VCSH FEW025 BKN030 02/M01 Q0996"
      );

      expect(metar.wind.degrees).toBe(260);
      expect(metar.wind.speed).toBe(26);
      expect(metar.wind.gust).toBe(40);
      expect(metar.wind.unit).toBe("KT");
      expect(metar.wind.minVariation).toBe(240);
      expect(metar.wind.maxVariation).toBe(300);
    });

    test("descriptive only", () => {
      const metar = new MetarParser().parse(
        "AGGH 140340Z 05010KT 9999 TS FEW020 SCT021CB BKN300 32/26 Q1010"
      );

      expect(metar.weatherConditions).toHaveLength(1);
      expect(metar.weatherConditions[0].descriptive).toBe(
        Descriptive.THUNDERSTORM
      );
    });

    test("with runway deposit", () => {
      const metar = new MetarParser().parse(
        "UNAA 240830Z 34002MPS CAVOK M14/M18 Q1019 R02/190054 NOSIG RMK QFE741"
      );

      expect(metar.station).toBe("UNAA");
      expect(metar.wind.degrees).toBe(340);
      expect(metar.wind.speed).toBe(2);
      expect(metar.wind.unit).toBe("MPS");
      expect(metar.cavok).toBe(true);
      expect(metar.nosig).toBe(true);
      expect(metar.remark).toBe("QFE741");
      expect(metar.remarks).toHaveLength(1);
    });
  });
});

describe("parseValidity", () => {
  test("parses", () => {
    const validity = parseValidity("3118/0124");

    expect(validity.startDay).toBe(31);
    expect(validity.startHour).toBe(18);
    expect(validity.endDay).toBe(1);
    expect(validity.endHour).toBe(24);
  });
});

describe("parseTemperature", () => {
  test("max", () => {
    const temperature = parseTemperature("TX15/0612Z");

    expect(temperature.temperature).toBe(15);
    expect(temperature.day).toBe(6);
    expect(temperature.hour).toBe(12);
  });

  test("min", () => {
    const temperature = parseTemperature("TNM02/0612Z");

    expect(temperature.temperature).toBe(-2);
    expect(temperature.day).toBe(6);
    expect(temperature.hour).toBe(12);
  });
});
