import { AbstractParser, RemarkParser } from "parser/parser";
import i18n from "commons/i18n";
import { Descriptive, Intensity, Phenomenon } from "model/enum";
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
