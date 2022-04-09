import { AbstractParser, MetarParser, RemarkParser } from "parser/parser";
import i18n from "commons/i18n";
import {
  CloudQuantity,
  CloudType,
  Descriptive,
  Intensity,
  Phenomenon,
  WeatherChangeType,
} from "model/enum";
import { IAbstractWeatherContainer } from "lib/model/model";

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
    // ["05009KT", true],
    // ["030V113", true],
    // ["9999", true],
    // ["6 1/2SM", true],
    // ["1100w", true],
    // ["VV002", true],
    // ["CAVOK", true],
    // ["SCT026CB", true],
    // ["ZZZ026CV", false],
    // ["+SHGSRA", true],
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
  (() => {
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
  })();

  describe("MetarParser", () => {
    (() => {
      // With tempo
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
    })();
  });
});
