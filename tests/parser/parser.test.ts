import {
  AbstractParser,
  MetarParser,
  parseTemperature,
  parseValidity,
  RemarkParser,
  TAFParser,
} from "parser/parser";
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
import en from "locale/en";
import { _, format } from "commons/i18n";

describe("RemarkParser", () => {
  (() => {
    const code = "Token AO1 End of remark";

    test(`parses "${code}"`, () => {
      const remarks = new RemarkParser(en).parse(code);

      expect(remarks).toStrictEqual([
        "Token",
        en.Remark.AO1,
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
      const weatherCondition = new StubParser(en).parseWeatherCondition(code);

      expect(weatherCondition.intensity).toBe(Intensity.LIGHT);
      expect(weatherCondition.phenomenons).toHaveLength(1);
      expect(weatherCondition.phenomenons[0]).toBe(Phenomenon.DRIZZLE);
    });
  })();

  (() => {
    const code = "SHRAGR";

    test(`parses "${code}"`, () => {
      const weatherCondition = new StubParser(en).parseWeatherCondition(code);

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

    const res = new StubParser(en).tokenize(code);

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
        new StubParser(en).generalParse(
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

    const metar = new MetarParser(en).parse(input);

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

      const metar = new MetarParser(en).parse(input);

      expect(metar.auto).toBe(true);
      expect(metar.clouds).toHaveLength(3);
      expect(metar.trends).toHaveLength(1);

      const trend = metar.trends[0];

      expect(trend.type).toBe(WeatherChangeType.TEMPO);
      expect(trend.wind).toBeDefined();
      expect(trend.wind?.degrees).toBe(260);
      expect(trend.wind?.speed).toBe(15);
      expect(trend.wind?.gust).toBe(25);
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
      const metar = new MetarParser(en).parse(
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
      const metar = new MetarParser(en).parse(
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
      const metar = new MetarParser(en).parse(
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
      const metar = new MetarParser(en).parse(
        "LFPG 161430Z 24015G25KT 5000 1100w"
      );

      expect(metar.day).toBe(16);
      expect(metar.hour).toBe(14);
      expect(metar.minute).toBe(30);
      expect(metar.wind?.degrees).toBe(240);
      expect(metar.wind?.speed).toBe(15);
      expect(metar.wind?.gust).toBe(25);
      expect(metar.visibility?.distance).toBe("5000m");
      expect(metar.visibility?.minDistance).toBe(1100);
      expect(metar.visibility?.minDirection).toBe("w");
    });

    test("wind variation", () => {
      const metar = new MetarParser(en).parse(
        "LFPG 161430Z 24015G25KT 180V300"
      );

      expect(metar.wind?.degrees).toBe(240);
      expect(metar.wind?.speed).toBe(15);
      expect(metar.wind?.gust).toBe(25);
      expect(metar.wind?.unit).toBe("KT");
      expect(metar.wind?.minVariation).toBe(180);
      expect(metar.wind?.maxVariation).toBe(300);
    });

    test("vertical visibility", () => {
      const metar = new MetarParser(en).parse(
        "LFLL 160730Z 28002KT 0350 FG VV002"
      );

      expect(metar.day).toBe(16);
      expect(metar.hour).toBe(7);
      expect(metar.minute).toBe(30);
      expect(metar.wind?.degrees).toBe(280);
      expect(metar.visibility?.distance).toBe("350m");
      expect(metar.verticalVisibility).toBe(200);
      expect(metar.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    });

    test("Ndv", () => {
      const metar = new MetarParser(en).parse(
        "LSZL 300320Z AUTO 00000KT 9999NDV BKN060 OVC074 00/M04 Q1001\n RMK="
      );

      expect(metar.visibility?.distance).toBe("> 10km");
    });

    test("cavok", () => {
      const metar = new MetarParser(en).parse(
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
      const metar = new MetarParser(en).parse(
        "KTTN 051853Z 04011KT 9999 VCTS SN FZFG BKN003 OVC010 M02/M02 A3006"
      );

      expect(metar.altimeter).toBe(1017);
      expect(metar.weatherConditions).toHaveLength(3);
    });

    test("wind alternative form", () => {
      const metar = new MetarParser(en).parse(
        "ENLK 081350Z 26026G40 240V300 9999 VCSH FEW025 BKN030 02/M01 Q0996"
      );

      expect(metar.wind?.degrees).toBe(260);
      expect(metar.wind?.speed).toBe(26);
      expect(metar.wind?.gust).toBe(40);
      expect(metar.wind?.unit).toBe("KT");
      expect(metar.wind?.minVariation).toBe(240);
      expect(metar.wind?.maxVariation).toBe(300);
    });

    test("descriptive only", () => {
      const metar = new MetarParser(en).parse(
        "AGGH 140340Z 05010KT 9999 TS FEW020 SCT021CB BKN300 32/26 Q1010"
      );

      expect(metar.weatherConditions).toHaveLength(1);
      expect(metar.weatherConditions[0].descriptive).toBe(
        Descriptive.THUNDERSTORM
      );
    });

    test("with runway deposit", () => {
      const metar = new MetarParser(en).parse(
        "UNAA 240830Z 34002MPS CAVOK M14/M18 Q1019 R02/190054 NOSIG RMK QFE741"
      );

      expect(metar.station).toBe("UNAA");
      expect(metar.wind?.degrees).toBe(340);
      expect(metar.wind?.speed).toBe(2);
      expect(metar.wind?.unit).toBe("MPS");
      expect(metar.cavok).toBe(true);
      expect(metar.nosig).toBe(true);
      expect(metar.remark).toBe("QFE741");
      expect(metar.remarks).toHaveLength(1);
    });

    test("with minimum visibility", () => {
      const metar = new MetarParser(en).parse(
        "SUMU 070520Z 34025KT 8000 2000SW VCSH SCT013CB BKN026 00/M05 Q1012 TEMPO 2000 SHSN="
      );

      expect(metar.station).toBe("SUMU");
      expect(metar.visibility).toBeDefined();
      expect(metar.visibility?.minDistance).toBe(2000);
      expect(metar.visibility?.minDirection).toBe("SW");
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

describe("TAFParser", () => {
  test("with invalid line breaks", () => {
    const code =
      "TAF LFPG 150500Z 1506/1612 17005KT 6000 SCT012 \n" +
      "TEMPO 1506/1509 3000 BR BKN006 PROB40 \n" +
      "TEMPO 1506/1508 0400 BCFG BKN002 PROB40 \n" +
      "TEMPO 1512/1516 4000 -SHRA FEW030TCU BKN040 \n" +
      "BECMG 1520/1522 CAVOK \n" +
      "TEMPO 1603/1608 3000 BR BKN006 PROB40 \n TEMPO 1604/1607 0400 BCFG BKN002 TX17/1512Z TN07/1605Z";

    const taf = new TAFParser(en).parse(code);

    expect(taf.station).toBe("LFPG");
    expect(taf.day).toBe(15);
    expect(taf.hour).toBe(5);
    expect(taf.minute).toBe(0);

    expect(taf.validity.startDay).toBe(15);
    expect(taf.validity.startHour).toBe(6);
    expect(taf.validity.endDay).toBe(16);
    expect(taf.validity.endHour).toBe(12);

    expect(taf.wind?.degrees).toBe(170);
    expect(taf.wind?.speed).toBe(5);
    expect(taf.wind?.gust).toBeUndefined();
    expect(taf.wind?.unit).toBe("KT");

    expect(taf.visibility?.distance).toBe("6000m");

    expect(taf.clouds).toHaveLength(1);
    expect(taf.clouds[0].quantity).toBe(CloudQuantity.SCT);
    expect(taf.clouds[0].height).toBe(1200);

    expect(taf.weatherConditions).toHaveLength(0);

    expect(taf.trends).toHaveLength(6);

    // First trend
    const trend0 = taf.trends[0];

    expect(trend0.type).toBe(WeatherChangeType.TEMPO);
    expect(trend0.validity?.startDay).toBe(15);
    expect(trend0.validity?.startHour).toBe(6);
    expect(trend0.validity?.endDay).toBe(15);
    expect(trend0.validity?.endHour).toBe(9);
    expect(trend0.visibility?.distance).toBe("3000m");
    expect(trend0.weatherConditions).toHaveLength(1);
    expect(trend0.weatherConditions[0].intensity).toBeUndefined();
    expect(trend0.weatherConditions[0].descriptive).toBeUndefined();
    expect(trend0.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.MIST);
    expect(trend0.clouds).toHaveLength(1);
    expect(trend0.clouds[0].quantity).toBe(CloudQuantity.BKN);
    expect(trend0.clouds[0].type).toBeUndefined();

    // Second trend
    const trend1 = taf.trends[1];
    expect(trend1.type).toBe(WeatherChangeType.TEMPO);
    expect(trend1.validity?.startDay).toBe(15);
    expect(trend1.validity?.startHour).toBe(6);
    expect(trend1.validity?.endDay).toBe(15);
    expect(trend1.validity?.endHour).toBe(8);
    expect(trend1.wind).toBeUndefined();
    expect(trend1.visibility?.distance).toBe("400m");
    expect(trend1.weatherConditions).toHaveLength(1);
    expect(trend1.weatherConditions[0].intensity).toBeUndefined();
    expect(trend1.weatherConditions[0].descriptive).toBe(Descriptive.PATCHES);
    expect(trend1.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(trend1.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    expect(trend1.clouds).toHaveLength(1);
    expect(trend1.clouds[0].quantity).toBe(CloudQuantity.BKN);
    expect(trend1.clouds[0].height).toBe(200);
    expect(trend1.probability).toBe(40);

    const trend2 = taf.trends[2];
    expect(trend2.type).toBe(WeatherChangeType.TEMPO);
    expect(trend2.validity?.startDay).toBe(15);
    expect(trend2.validity?.startHour).toBe(12);
    expect(trend2.validity?.endDay).toBe(15);
    expect(trend2.validity?.endHour).toBe(16);
    expect(trend2.visibility?.distance).toBe("4000m");
    expect(trend2.weatherConditions).toHaveLength(1);
    expect(trend2.weatherConditions[0].intensity).toBe(Intensity.LIGHT);
    expect(trend2.weatherConditions[0].descriptive).toBe(Descriptive.SHOWERS);
    expect(trend2.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(trend2.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.RAIN);
    expect(trend2.clouds).toHaveLength(2);
    expect(trend2.clouds[0].quantity).toBe(CloudQuantity.FEW);
    expect(trend2.clouds[0].type).toBe(CloudType.TCU);
    expect(trend2.clouds[1].quantity).toBe(CloudQuantity.BKN);
    expect(trend2.clouds[1].type).toBeUndefined();
    expect(trend2.probability).toBe(40);

    const trend3 = taf.trends[3];
    expect(trend3.type).toBe(WeatherChangeType.BECMG);
    expect(trend3.validity?.startDay).toBe(15);
    expect(trend3.validity?.startHour).toBe(20);
    expect(trend3.validity?.endDay).toBe(15);
    expect(trend3.validity?.endHour).toBe(22);

    // Fourth Tempo
    const trend4 = taf.trends[4];
    expect(trend4.validity?.startDay).toBe(16);
    expect(trend4.validity?.startHour).toBe(3);
    expect(trend4.validity?.endDay).toBe(16);
    expect(trend4.validity?.endHour).toBe(8);
    expect(trend4.visibility?.distance).toBe("3000m");
    expect(trend4.weatherConditions).toHaveLength(1);
    expect(trend4.weatherConditions[0].intensity).toBeUndefined();
    expect(trend4.weatherConditions[0].descriptive).toBeUndefined();
    expect(trend4.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(trend4.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.MIST);
    expect(trend4.clouds).toHaveLength(1);
    expect(trend4.clouds[0].quantity).toBe(CloudQuantity.BKN);
    expect(trend4.clouds[0].type).toBeUndefined();
    expect(trend4.probability).toBeUndefined();

    // Fifth Tempo
    const trend5 = taf.trends[5];
    expect(trend5.validity?.startDay).toBe(16);
    expect(trend5.validity?.startHour).toBe(4);
    expect(trend5.validity?.endDay).toBe(16);
    expect(trend5.validity?.endHour).toBe(7);
    expect(trend5.visibility?.distance).toBe("400m");
    expect(trend5.weatherConditions).toHaveLength(1);
    expect(trend5.weatherConditions[0].intensity).toBeUndefined();
    expect(trend5.weatherConditions[0].descriptive).toBe(Descriptive.PATCHES);
    expect(trend5.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(trend5.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    expect(trend5.clouds).toHaveLength(1);
    expect(trend5.clouds[0].quantity).toBe(CloudQuantity.BKN);
    expect(trend5.clouds[0].type).toBeUndefined();
    expect(trend5.probability).toBe(40);
  });

  test("without line breaks", () => {
    const taf = new TAFParser(en).parse(
      "TAF LSZH 292025Z 2921/3103 VRB03KT 9999 FEW020 BKN080 TX20/3014Z TN06/3003Z PROB30 TEMPO 2921/2923 SHRA BECMG 3001/3004 4000 MIFG NSC PROB40 3003/3007 1500 BCFG SCT004 PROB30 3004/3007 0800 FG VV003 BECMG 3006/3009 9999 FEW030 PROB40 TEMPO 3012/3017 30008KT"
    );

    // Check on time delivery
    expect(taf.day).toBe(29);
    expect(taf.hour).toBe(20);
    expect(taf.minute).toBe(25);

    // Checks on validity
    expect(taf.validity.startDay).toBe(29);
    expect(taf.validity.startHour).toBe(21);
    expect(taf.validity.endDay).toBe(31);
    expect(taf.validity.endHour).toBe(3);

    // Checks on wind
    expect(taf.wind?.degrees).toBeUndefined();
    expect(taf.wind?.direction).toBe("VRB");
    expect(taf.wind?.speed).toBe(3);
    expect(taf.wind?.gust).toBeUndefined();
    expect(taf.wind?.unit).toBe("KT");

    // Checks on visibility
    expect(taf.visibility?.distance).toBe("> 10km");

    // Checks on clouds
    expect(taf.clouds).toHaveLength(2);
    expect(taf.clouds[0].quantity).toBe(CloudQuantity.FEW);
    expect(taf.clouds[1].height).toBe(8000);
    expect(taf.clouds[1].type).toBeUndefined();

    // Check that no weatherCondition
    expect(taf.weatherConditions).toHaveLength(0);

    // Check max temperature
    expect(taf.maxTemperature?.day).toBe(30);
    expect(taf.maxTemperature?.hour).toBe(14);
    expect(taf.maxTemperature?.temperature).toBe(20);

    // Check min temperature
    expect(taf.minTemperature?.day).toBe(30);
    expect(taf.minTemperature?.hour).toBe(3);
    expect(taf.minTemperature?.temperature).toBe(6);

    // First TEMPO
    const tempo0 = taf.trends[0];
    expect(tempo0.validity?.startDay).toBe(29);
    expect(tempo0.validity?.startHour).toBe(21);
    expect(tempo0.validity?.endDay).toBe(29);
    expect(tempo0.validity?.endHour).toBe(23);
    expect(tempo0.weatherConditions).toHaveLength(1);
    expect(tempo0.weatherConditions[0].intensity).toBeUndefined();
    expect(tempo0.weatherConditions[0].descriptive).toBe(Descriptive.SHOWERS);
    expect(tempo0.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(tempo0.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.RAIN);
    expect(tempo0.probability).toBe(30);

    // First BECOMG
    const becmg0 = taf.trends[1];
    expect(becmg0.validity?.startDay).toBe(30);
    expect(becmg0.validity?.startHour).toBe(1);
    expect(becmg0.validity?.endDay).toBe(30);
    expect(becmg0.validity?.endHour).toBe(4);
    expect(becmg0.visibility?.distance).toBe("4000m");
    expect(becmg0.weatherConditions[0].intensity).toBeUndefined();
    expect(becmg0.weatherConditions[0].descriptive).toBe(Descriptive.SHALLOW);
    expect(becmg0.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(becmg0.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    expect(becmg0.clouds[0].quantity).toBe(CloudQuantity.NSC);

    // First PROB
    const prob0 = taf.trends[2];
    expect(prob0.validity?.startDay).toBe(30);
    expect(prob0.validity?.startHour).toBe(3);
    expect(prob0.validity?.endDay).toBe(30);
    expect(prob0.validity?.endHour).toBe(7);
    expect(prob0.visibility?.distance).toBe("1500m");
    expect(prob0.weatherConditions[0].intensity).toBeUndefined();
    expect(prob0.weatherConditions[0].descriptive).toBe(Descriptive.PATCHES);
    expect(prob0.weatherConditions[0].phenomenons).toHaveLength(1);
    expect(prob0.weatherConditions[0].phenomenons[0]).toBe(Phenomenon.FOG);
    expect(prob0.clouds).toHaveLength(1);
    expect(prob0.clouds[0].quantity).toBe(CloudQuantity.SCT);
    expect(prob0.clouds[0].type).toBeUndefined();
    expect(prob0.probability).toBe(40);

    // Second BECOMG
    const becmg1 = taf.trends[4];
    expect(becmg1.validity?.startDay).toBe(30);
    expect(becmg1.validity?.startHour).toBe(6);
    expect(becmg1.validity?.endDay).toBe(30);
    expect(becmg1.validity?.endHour).toBe(9);
    expect(becmg1.visibility?.distance).toBe("> 10km");
    expect(becmg1.weatherConditions).toHaveLength(0);
    expect(becmg1.clouds).toHaveLength(1);
    expect(becmg1.clouds[0].quantity).toBe(CloudQuantity.FEW);
    expect(becmg1.clouds[0].height).toBe(3000);
    expect(becmg1.clouds[0].type).toBeUndefined();

    // Second TEMPO
    const tempo1 = taf.trends[5];
    expect(tempo1.validity?.startDay).toBe(30);
    expect(tempo1.validity?.startHour).toBe(12);
    expect(tempo1.validity?.endDay).toBe(30);
    expect(tempo1.validity?.endHour).toBe(17);
    expect(tempo1.weatherConditions).toHaveLength(0);
    expect(tempo1.wind?.degrees).toBe(300);
    expect(tempo1.wind?.speed).toBe(8);
    expect(tempo1.wind?.gust).toBeUndefined();
    expect(tempo1.wind?.unit).toBe("KT");
    expect(tempo1.probability).toBe(40);
  });

  test("parse without line breaks and ending temperature", () => {
    const taf = new TAFParser(en).parse(
      "TAF KLSV 120700Z 1207/1313 VRB06KT 9999 SCT250 QNH2992INS BECMG 1217/1218 10010G15KT 9999 SCT250 QNH2980INS BECMG 1303/1304 VRB06KT 9999 FEW250 QNH2979INS TX42/1223Z TN24/1213Z"
    );

    // Check on time delivery
    expect(taf.day).toBe(12);
    expect(taf.hour).toBe(7);
    expect(taf.minute).toBe(0);

    // Checks on validity
    expect(taf.validity.startDay).toBe(12);
    expect(taf.validity.startHour).toBe(7);
    expect(taf.validity.endDay).toBe(13);
    expect(taf.validity.endHour).toBe(13);

    // Checks on wind
    expect(taf.wind?.degrees).toBeUndefined();
    expect(taf.wind?.direction).toBe("VRB");
    expect(taf.wind?.speed).toBe(6);
    expect(taf.wind?.gust).toBeUndefined();
    expect(taf.wind?.unit).toBe("KT");

    // Checks on visibility
    expect(taf.visibility?.distance).toBe("> 10km");

    // Checks on clouds
    expect(taf.clouds).toHaveLength(1);
    expect(taf.clouds[0].quantity).toBe(CloudQuantity.SCT);
    expect(taf.clouds[0].height).toBe(25000);
    expect(taf.clouds[0].type).toBeUndefined();

    // Check that no weatherCondition
    expect(taf.weatherConditions).toHaveLength(0);

    // Check max temperature
    expect(taf.maxTemperature?.day).toBe(12);
    expect(taf.maxTemperature?.hour).toBe(23);
    expect(taf.maxTemperature?.temperature).toBe(42);

    // Check min temperature
    expect(taf.minTemperature?.day).toBe(12);
    expect(taf.minTemperature?.hour).toBe(13);
    expect(taf.minTemperature?.temperature).toBe(24);

    // Check on BECOMGs
    expect(taf.trends).toHaveLength(2);

    // First BECOMG
    const becmg1 = taf.trends[0];
    expect(becmg1.validity?.startDay).toBe(12);
    expect(becmg1.validity?.startHour).toBe(17);
    expect(becmg1.validity?.endDay).toBe(12);
    expect(becmg1.validity?.endHour).toBe(18);
    expect(becmg1.visibility?.distance).toBe("> 10km");
    expect(becmg1.wind?.degrees).toBe(100);
    expect(becmg1.wind?.speed).toBe(10);
    expect(becmg1.wind?.gust).toBe(15);
    expect(becmg1.wind?.unit).toBe("KT");
    expect(becmg1.weatherConditions).toHaveLength(0);
    expect(becmg1.clouds).toHaveLength(1);
    expect(becmg1.clouds[0].quantity).toBe(CloudQuantity.SCT);
    expect(becmg1.clouds[0].height).toBe(25000);
    expect(becmg1.clouds[0].type).toBeUndefined();

    // Second BECOMG
    const becmg2 = taf.trends[1];
    expect(becmg2.validity?.startDay).toBe(13);
    expect(becmg2.validity?.startHour).toBe(3);
    expect(becmg2.validity?.endDay).toBe(13);
    expect(becmg2.validity?.endHour).toBe(4);
    expect(becmg2.visibility?.distance).toBe("> 10km");
    expect(becmg2.wind?.degrees).toBeUndefined();
    expect(becmg2.wind?.speed).toBe(6);
    expect(becmg2.wind?.gust).toBeUndefined();
    expect(becmg2.wind?.unit).toBe("KT");
    expect(becmg2.weatherConditions).toHaveLength(0);
    expect(becmg2.clouds).toHaveLength(1);
    expect(becmg2.clouds[0].quantity).toBe(CloudQuantity.FEW);
    expect(becmg2.clouds[0].height).toBe(25000);
    expect(becmg2.clouds[0].type).toBeUndefined();
  });

  test("parse with 2 taf", () => {
    const taf = new TAFParser(en).parse(
      "TAF TAF LFPG 191100Z 1912/2018 02010KT 9999 FEW040 PROB30"
    );

    expect(taf).toBeDefined();
    expect(taf.trends).toHaveLength(1);
    expect(taf.trends[0].probability).toBe(30);
  });

  test("parse with wind shear", () => {
    const taf = new TAFParser(en).parse(
      "TAF KMKE 011530 0116/0218 WS020/24045KT FM010200 17005KT P6SM SKC WS020/23055KT"
    );

    // THEN the windshear of the principle part is decoded
    expect(taf.windShear?.height).toBe(2000);
    expect(taf.windShear?.degrees).toBe(240);
    expect(taf.windShear?.speed).toBe(45);

    // Checks on the from part
    const fm = taf.trends[0];
    expect(fm).toBeDefined();

    // Checks on the wind of the FM
    expect(fm.wind).toBeDefined();
    expect(fm.wind?.degrees).toBe(170);
    expect(fm.wind?.speed).toBe(5);

    // Checks on the wind shear of the fm
    expect(fm.windShear).toBeDefined();
    expect(fm.windShear?.height).toBe(2000);
    expect(fm.windShear?.degrees).toBe(230);
    expect(fm.windShear?.speed).toBe(55);
  });

  test("with nautical miles visibility", () => {
    const taf = new TAFParser(en).parse(
      "TAF AMD CZBF 300939Z 3010/3022 VRB03KT 6SM -SN OVC015 TEMPO 3010/3012 11/2SM -SN OVC009 \nFM301200 10008KT 2SM -SN OVC010 TEMPO 3012/3022 3/4SM -SN VV007 RMK FCST BASED ON AUTO OBS. NXT FCST BY 301400Z"
    );

    // THEN the visibility of the main event is 6 SM
    expect(taf.visibility?.distance).toBe("6SM");
    // THEN the visibility of the first tempo is 11/2 SM
    expect(taf.trends[0].visibility?.distance).toBe("11/2SM");
    // THEN the visibility of the second tempo is 3/4 SM
    expect(taf.trends[2].visibility?.distance).toBe("3/4SM");
    // Then the visibility of the FROM part is 2SN
    expect(taf.trends[1].visibility?.distance).toBe("2SM");
    expect(taf.amendment).toBe(true);
  });

  test("parse with remark", () => {
    const taf = new TAFParser(en).parse(
      "TAF CZBF 300939Z 3010/3022 VRB03KT 6SM -SN OVC015 RMK FCST BASED ON AUTO OBS. NXT FCST BY 301400Z\n TEMPO 3010/3012 11/2SM -SN OVC009 FM301200 10008KT 2SM -SN OVC010 \nTEMPO 3012/3022 3/4SM -SN VV007"
    );

    expect(taf).toBeDefined();
    expect(taf.remark).toBeDefined();
    expect(taf.remarks).toHaveLength(9);
  });

  test("parse with trend remark", () => {
    const taf = new TAFParser(en).parse(
      "TAF CZBF 300939Z 3010/3022 VRB03KT 6SM -SN OVC015\n TEMPO 3010/3012 11/2SM -SN OVC009 FM301200 10008KT 2SM -SN OVC010 TEMPO 3012/3022 3/4SM -SN VV007 RMK FCST BASED ON AUTO OBS. NXT FCST BY 301400Z"
    );

    expect(taf.trends).toHaveLength(3);
    expect(taf.trends[2].remark).toBeDefined();
    expect(taf.trends[2].remarks).toHaveLength(9);
  });
});

describe("RemarkParser", () => {
  test("parse A01", () => {
    const remarks = new RemarkParser(en).parse("Token AO1 End of remark");

    expect(remarks).toHaveLength(5);
    expect(remarks[1]).toBe(_("Remark.AO1", en));
  });

  test("parse A01", () => {
    const remarks = new RemarkParser(en).parse("Token AO2 End of remark");

    expect(remarks).toHaveLength(5);
    expect(remarks[1]).toBe(_("Remark.AO2", en));
  });

  test("parse peak wind hour", () => {
    const remarks = new RemarkParser(en).parse("AO1 PK WND 28045/15");

    expect(remarks).toHaveLength(2);
    expect(remarks[0]).toBe(_("Remark.AO1", en));
    expect(remarks[1]).toBe(
      format(_("Remark.PeakWind", en), "280", "45", "", "15")
    );
  });

  test("parse peak wind another hour", () => {
    const remarks = new RemarkParser(en).parse("AO1 PK WND 28045/1515");

    expect(remarks).toHaveLength(2);
    expect(remarks[0]).toBe(_("Remark.AO1", en));
    expect(remarks[1]).toBe(
      format(_("Remark.PeakWind", en), "280", "45", "15", "15")
    );
  });

  test("parse wind shift hour", () => {
    const remarks = new RemarkParser(en).parse("AO1 WSHFT 30");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.WindShift.0", en), "", 30));
  });

  test("parse wind shift", () => {
    const remarks = new RemarkParser(en).parse("AO1 WSHFT 1530");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.WindShift.0", en), 15, 30));
  });

  test("parse wind shift frontal", () => {
    const remarks = new RemarkParser(en).parse("AO1 WSHFT 1530 FROPA");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.WindShift.FROPA", en), 15, 30));
  });

  test("parse wind shift frontal at hour", () => {
    const remarks = new RemarkParser(en).parse("AO1 WSHFT 30 FROPA");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.WindShift.FROPA", en), "", 30));
  });

  test("parse tower visibility", () => {
    const remarks = new RemarkParser(en).parse("AO1 TWR VIS 16 1/2");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.Tower.Visibility", en), "16 1/2"));
  });

  test("parse surface visibility", () => {
    const remarks = new RemarkParser(en).parse("AO1 SFC VIS 16 1/2");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Surface.Visibility", en), "16 1/2")
    );
  });

  test("parse prevailing visibility", () => {
    const remarks = new RemarkParser(en).parse("AO1 VIS 1/2V2");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Variable.Prevailing.Visibility", en), "1/2", "2")
    );
  });

  test("parse sector visibility", () => {
    const remarks = new RemarkParser(en).parse("AO1 VIS NE 2 1/2");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Sector.Visibility", en), _("Converter.NE", en), "2 1/2")
    );
  });

  test("parse second location visibility", () => {
    const remarks = new RemarkParser(en).parse("AO1 VIS 2 1/2 RWY11");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Second.Location.Visibility", en), "2 1/2", "RWY11")
    );
  });

  test("parse tornadic activity tornado", () => {
    const remarks = new RemarkParser(en).parse("AO1 TORNADO B13 6 NE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Tornadic.Activity.Beginning", en),
        _("Remark.TORNADO", en),
        "",
        13,
        6,
        _("Converter.NE", en)
      )
    );
  });

  test("parse tornadic activity tornado hour", () => {
    const remarks = new RemarkParser(en).parse("AO1 TORNADO B1513 6 NE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Tornadic.Activity.Beginning", en),
        _("Remark.TORNADO", en),
        15,
        13,
        6,
        _("Converter.NE", en)
      )
    );
  });

  test("parse tornadic activity funnel cloud", () => {
    const remarks = new RemarkParser(en).parse(
      "AO1 FUNNEL CLOUD B1513E1630 6 NE"
    );

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Tornadic.Activity.BegEnd", en),
        _("Remark.FUNNELCLOUD", en),
        15,
        13,
        16,
        30,
        6,
        _("Converter.NE", en)
      )
    );
  });

  test("parse tornadic activity water spout ending time minutes", () => {
    const remarks = new RemarkParser(en).parse("AO1 WATERSPOUT E16 12 NE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Tornadic.Activity.Ending", en),
        _("Remark.WATERSPOUT", en),
        "",
        16,
        12,
        _("Converter.NE", en)
      )
    );
  });

  test("parse tornadic activity water spout ending time", () => {
    const remarks = new RemarkParser(en).parse("AO1 WATERSPOUT E1516 12 NE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Tornadic.Activity.Ending", en),
        _("Remark.WATERSPOUT", en),
        15,
        16,
        12,
        _("Converter.NE", en)
      )
    );
  });

  test("parse precipitation start end", () => {
    const remarks = new RemarkParser(en).parse("AO1 RAB05E30SNB1520E1655");

    expect(remarks).toHaveLength(3);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Precipitation.Beg.End", en),
        "",
        _("Phenomenon.RA", en),
        "",
        "05",
        "",
        30
      )
    );
    expect(remarks[2]).toBe(
      format(
        _("Remark.Precipitation.Beg.End", en),
        "",
        _("Phenomenon.SN", en),
        15,
        20,
        16,
        55
      )
    );
  });

  test("parse precipitation start end descriptive", () => {
    const remarks = new RemarkParser(en).parse("AO1 SHRAB05E30SHSNB20E55");

    expect(remarks).toHaveLength(3);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Precipitation.Beg.End", en),
        _("Descriptive.SH", en),
        _("Phenomenon.RA", en),
        "",
        "05",
        "",
        30
      )
    );
    expect(remarks[2]).toBe(
      format(
        _("Remark.Precipitation.Beg.End", en),
        _("Descriptive.SH", en),
        _("Phenomenon.SN", en),
        "",
        20,
        "",
        55
      )
    );
  });

  test("parse thunderstorm start", () => {
    const remarks = new RemarkParser(en).parse("AO1 TSB0159E30");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Precipitation.Beg.End", en),
        "",
        _("Phenomenon.TS", en),
        "01",
        59,
        "",
        30
      )
    );
  });

  test("parse thunderstorm location", () => {
    const remarks = new RemarkParser(en).parse("AO1 TS SE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Thunderstorm.Location.0", en), _("Converter.SE", en))
    );
  });

  test("parse thunderstorm location moving", () => {
    const remarks = new RemarkParser(en).parse("AO1 TS SE MOV NE");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Thunderstorm.Location.Moving", en),
        _("Converter.SE", en),
        _("Converter.NE", en)
      )
    );
  });

  test("parse hail size", () => {
    const remarks = new RemarkParser(en).parse("AO1 GR 1 3/4");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.Hail.0", en), "1 3/4"));
  });

  test("parse hail size less than", () => {
    const remarks = new RemarkParser(en).parse("AO1 GR LESS THAN 1/4");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.Hail.LesserThan", en), "1/4"));
  });

  test("parse snow pellets", () => {
    const remarks = new RemarkParser(en).parse("AO1 GS MOD");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Snow.Pellets", en), _("Remark.MOD", en))
    );
  });

  test("parse virga direction", () => {
    const remarks = new RemarkParser(en).parse("AO1 VIRGA SW");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(_("Remark.Virga.Direction", en), _("Converter.SW", en))
    );
  });

  test("parse virga", () => {
    const remarks = new RemarkParser(en).parse("AO1 VIRGA");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.VIRGA", en)));
  });

  test("parse ceiling height", () => {
    const remarks = new RemarkParser(en).parse("AO1 CIG 005V010");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(format(_("Remark.Ceiling.Height", en), 500, 1000));
  });

  test("parse obscurations", () => {
    const remarks = new RemarkParser(en).parse("AO1 FU BKN020");

    expect(remarks).toHaveLength(2);
    expect(remarks[1]).toBe(
      format(
        _("Remark.Obscuration", en),
        _("CloudQuantity.BKN", en),
        2000,
        _("Phenomenon.FU", en)
      )
    );
  });

  test("parse variable sky condition without layer", () => {
    const remarks = new RemarkParser(en).parse("BKN V OVC");

    expect(remarks[0]).toBe(
      format(
        _("Remark.Variable.Sky.Condition.0", en),
        _("CloudQuantity.BKN", en),
        _("CloudQuantity.OVC", en)
      )
    );
  });

  test("parse variable sky condition", () => {
    const remarks = new RemarkParser(en).parse("BKN014 V OVC");

    expect(remarks[0]).toBe(
      format(
        _("Remark.Variable.Sky.Condition.Height", en),
        1400,
        _("CloudQuantity.BKN", en),
        _("CloudQuantity.OVC", en)
      )
    );
  });

  test("parseceiling second location", () => {
    const remarks = new RemarkParser(en).parse("CIG 002 RWY11");

    expect(remarks[0]).toBe(
      format(_("Remark.Ceiling.Second.Location", en), 200, "RWY11")
    );
  });

  test("parse sea level pressure", () => {
    const remarks = new RemarkParser(en).parse("AO1 SLP134");

    expect(remarks[1]).toBe(
      format(_("Remark.Sea.Level.Pressure", en), "1013.4")
    );
  });

  test("parse sea level pressure lower", () => {
    const remarks = new RemarkParser(en).parse("AO1 SLP982");

    expect(remarks[1]).toBe(
      format(_("Remark.Sea.Level.Pressure", en), "998.2")
    );
  });

  test("parse snow increasing rapidly", () => {
    const remarks = new RemarkParser(en).parse("AO1 SNINCR 2/10");

    expect(remarks[1]).toBe(
      format(_("Remark.Snow.Increasing.Rapidly", en), 2, 10)
    );
  });

  test("parse rmk slp", () => {
    const remarks = new RemarkParser(en).parse(
      "CF1AC8 CF TR SLP091 DENSITY ALT 200FT"
    );

    expect(remarks[3]).toBe(
      format(_("Remark.Sea.Level.Pressure", en), "1009.1")
    );
  });

  test("parse hourly maximum minimum temperature command", () => {
    const remarks = new RemarkParser(en).parse("401001015 AO1");

    expect(remarks[0]).toBe(
      "24-hour maximum temperature of 10.0°C and 24-hour minimum temperature of -1.5°C"
    );
  });

  test("parse hourly maximum temperature below zero", () => {
    const remarks = new RemarkParser(en).parse("11021 AO1");

    expect(remarks[0]).toBe("6-hourly maximum temperature of -2.1°C");
  });

  test("parse hourly maximum temperature above zero", () => {
    const remarks = new RemarkParser(en).parse("10142");

    expect(remarks[0]).toBe("6-hourly maximum temperature of 14.2°C");
  });

  test("parse hourly minimum temperature negative", () => {
    const remarks = new RemarkParser(en).parse("21001");

    expect(remarks[0]).toBe("6-hourly minimum temperature of -0.1°C");
  });

  test("parse hourly minimum temperature positive", () => {
    const remarks = new RemarkParser(en).parse("20012");

    expect(remarks[0]).toBe("6-hourly minimum temperature of 1.2°C");
  });

  test("parse hourly pressure", () => {
    const remarks = new RemarkParser(en).parse("52032");

    expect(remarks[0]).toBe(
      "steady or unsteady increase of 3.2 hectopascals in the past 3 hours"
    );
  });

  test("parse precipitation amount 24 hour", () => {
    const remarks = new RemarkParser(en).parse("70125");

    expect(remarks[0]).toBe(
      "1.25 inches of precipitation fell in the last 24 hours"
    );
  });

  test("parse snow depth", () => {
    const remarks = new RemarkParser(en).parse("4/021");

    expect(remarks[0]).toBe("snow depth of 21 inches");
  });

  test("parse sunshine duration", () => {
    const remarks = new RemarkParser(en).parse("98096");

    expect(remarks[0]).toBe("96 minutes of sunshine");
  });

  test("parse water equivelant snow", () => {
    const remarks = new RemarkParser(en).parse("933036");

    expect(remarks[0]).toBe("water equivalent of 3.6 inches of snow");
  });

  test("parse ice accretion", () => {
    const remarks = new RemarkParser(en).parse("l1004 AO1");

    expect(remarks[0]).toBe(
      "4/100 of an inch of ice accretion in the past 1 hour(s)"
    );
  });

  test("parse hourly temperature", () => {
    const remarks = new RemarkParser(en).parse("T0026 AO1");

    expect(remarks[0]).toBe("hourly temperature of 2.6°C");
  });

  test("parse hourly temperature dew point", () => {
    const remarks = new RemarkParser(en).parse("T00261015 AO1");

    expect(remarks[0]).toBe(
      "hourly temperature of 2.6°C and dew point of -1.5°C"
    );
  });

  test("parse precipitation amount 3 hours", () => {
    const remarks = new RemarkParser(en).parse("30217");

    expect(remarks[0]).toBe(
      "2.17 inches of precipitation fell in the last 3 hours"
    );
  });

  test("parse precipitation amount 6 hours", () => {
    const remarks = new RemarkParser(en).parse("60217");

    expect(remarks[0]).toBe(
      "2.17 inches of precipitation fell in the last 6 hours"
    );
  });
});
