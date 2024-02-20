import {
  getForecastFromTAF,
  getCompositeForecastForDate,
  TimestampOutOfBoundsError,
} from "forecast/forecast";
import { parseTAF, Phenomenon, WeatherChangeType } from "index";

describe("getForecastFromTAF", () => {
  test("simple case", () => {
    const taf = parseTAF("TAF KMSN 142325Z 1500/1524", {
      issued: new Date("2022-04-14"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));
  });

  test("day passed is ahead", () => {
    const taf = parseTAF("TAF KMSN 142325Z 1500/1524", {
      issued: new Date("2022-04-17"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-14T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));
  });

  test("with validity rolling over to next month", () => {
    const taf = parseTAF("TAF KMSN 302325Z 0100/0124", {
      issued: new Date("2022-04-29"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-30T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-05-01T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-05-02T00:00:00.000Z"));
  });

  test("with properly set start/end with only one forecast", () => {
    const taf = parseTAF("TAF KMSN 302325Z 0100/0124", {
      issued: new Date("2022-05-02"),
    });
    const forecast = getForecastFromTAF(taf);

    expect(forecast.forecast).toHaveLength(1);
    expect(forecast.forecast[0].start).toEqual(
      new Date("2022-05-01T00:00:00.000Z"),
    );
    expect(forecast.forecast[0].end).toEqual(
      new Date("2022-05-02T00:00:00.000Z"),
    );
  });

  test("should set maxTemperature, minTemperature, flags", () => {
    const taf = parseTAF(
      `
TAF AMD SBPJ 221450Z 2218/2318 TN25/2309Z TX34/2316Z
    `,
      { issued: new Date("2022-10-22") },
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.maxTemperature?.temperature).toBe(34);
    expect(forecast.maxTemperature?.date).toEqual(
      new Date("2022-10-23T16:00:00.000Z"),
    );
    expect(forecast.minTemperature?.temperature).toBe(25);
    expect(forecast.minTemperature?.date).toEqual(
      new Date("2022-10-23T09:00:00.000Z"),
    );
    expect(forecast.amendment).toBe(true);
  });

  test("should have forecasts", () => {
    const taf = parseTAF(
      `
TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
    TEMPO 1500/1502 6SM -SHRASN BKN035
    FM150100 25012G25KT P6SM VCSH SCT040 BKN070
    FM150300 26011G21KT P6SM SCT080
    `,
      { issued: new Date("2022-04-29") },
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-14T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].start).toEqual(
      new Date("2022-04-15T00:00:00.000Z"),
    );
    expect(forecast.forecast[0].end).toEqual(
      new Date("2022-04-15T01:00:00.000Z"),
    );
    expect(forecast.forecast[0].end).toEqual(forecast.forecast[2].start);
    expect(forecast.forecast[1].start).toEqual(
      new Date("2022-04-15T00:00:00.000Z"),
    );
    expect(forecast.forecast[1].end).toEqual(
      new Date("2022-04-15T02:00:00.000Z"),
    );
    expect(forecast.forecast[1].end).not.toEqual(forecast.forecast[2].start);
    expect(forecast.forecast[2].start).toEqual(
      new Date("2022-04-15T01:00:00.000Z"),
    );
    expect(forecast.forecast[2].end).toEqual(forecast.forecast[3].start);
    expect(forecast.forecast[3].start).toEqual(
      new Date("2022-04-15T03:00:00.000Z"),
    );
    expect(forecast.forecast[3].end).toEqual(
      new Date("2022-04-16T00:00:00.000Z"),
    );

    expect(forecast.forecast[forecast.forecast.length - 1].end).toEqual(
      forecast.end,
    );
  });

  test("should properly parse start/end with one BECMG", () => {
    const taf = parseTAF(
      `
    TAF ESGG 260830Z 2609/2709 02009KT 3000 BR BKN003
      BECMG 2609/2611 9999 NSW FEW015
    `,
      { issued: new Date("2022-04-29") },
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-26T08:30:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-26T09:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-27T09:00:00.000Z"));
  });

  test("should hydrate BECMG", () => {
    const taf = parseTAF(
      `
TAF SBPJ 221450Z 2218/2318 21006KT 8000 SCT030 FEW040TCU TN25/2309Z TX34/2316Z
  BECMG 2221/2223 VRB03KT FEW030
  BECMG 2302/2304 16003KT 5000 FU RMK PGU
  BECMG 2313/2315 23005KT SCT030 FEW040TCU
    `,
      { issued: new Date("2022-10-22") },
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-10-22T14:50:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-10-22T18:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-10-23T18:00:00.000Z"));

    expect(forecast.forecast).toHaveLength(4);

    const initial = forecast.forecast[0];
    expect(initial.start).toEqual(new Date("2022-10-22T18:00:00.000Z"));
    expect(initial.end).toEqual(new Date("2022-10-22T21:00:00.000Z"));
    expect(initial.clouds).toHaveLength(2);
    expect(initial.weatherConditions).toHaveLength(0);
    expect(initial.visibility?.value).toEqual(8000);

    const becmg0 = forecast.forecast[1];
    expect(initial.end).toEqual(becmg0.start);

    expect(becmg0.start).toEqual(new Date("2022-10-22T21:00:00.000Z"));
    expect(becmg0.end).toEqual(new Date("2022-10-23T02:00:00.000Z"));
    expect(becmg0.clouds).toHaveLength(1);
    expect(becmg0.weatherConditions).toHaveLength(0);
    expect(becmg0.visibility?.value).toEqual(8000);

    if (becmg0.type !== WeatherChangeType.BECMG)
      throw new Error("Expected BECMG");
    expect(becmg0.by).toEqual(new Date("2022-10-22T23:00:00.000Z"));

    const becmg1 = forecast.forecast[2];
    expect(becmg0.end).toEqual(becmg1.start);

    expect(becmg1.start).toEqual(new Date("2022-10-23T02:00:00.000Z"));
    expect(becmg1.end).toEqual(new Date("2022-10-23T13:00:00.000Z"));
    expect(becmg1.clouds).toHaveLength(1);
    expect(becmg1.remarks).toHaveLength(1);
    expect(becmg1.remark).toBe("PGU");
    expect(becmg1.weatherConditions).toHaveLength(1);
    expect(becmg1.visibility?.value).toEqual(5000);

    if (becmg1.type !== WeatherChangeType.BECMG)
      throw new Error("Expected BECMG");
    expect(becmg1.by).toEqual(new Date("2022-10-23T04:00:00.000Z"));

    const becmg2 = forecast.forecast[3];
    expect(becmg1.end).toEqual(becmg2.start);

    expect(becmg2.start).toEqual(new Date("2022-10-23T13:00:00.000Z"));
    expect(becmg2.end).toEqual(new Date("2022-10-23T18:00:00.000Z"));
    expect(becmg2.clouds).toHaveLength(2);
    expect(becmg2.remarks).toHaveLength(0);
    expect(becmg2.remark).toBeUndefined();
    expect(becmg2.weatherConditions).toHaveLength(1);
    expect(becmg2.visibility?.value).toEqual(5000);

    if (becmg2.type !== WeatherChangeType.BECMG)
      throw new Error("Expected BECMG");
    expect(becmg2.by).toEqual(new Date("2022-10-23T15:00:00.000Z"));

    expect(forecast.forecast[forecast.forecast.length - 1].end).toEqual(
      forecast.end,
    );
  });

  test("should have right trend types", () => {
    const taf = parseTAF(
      `
TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
    TEMPO 1500/1501 6SM -SHRASN BKN035
    FM150100 25012G25KT P6SM VCSH SCT040 BKN070
    FM150300 26011G21KT P6SM SCT080
    `,
      { issued: new Date("2022-04-29") },
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].type).toBeUndefined();
    expect(forecast.forecast[0].raw).toBe(
      "TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070",
    );
    expect(forecast.forecast[1].type).toBe(WeatherChangeType.TEMPO);
    expect(forecast.forecast[1].raw).toBe("TEMPO 1500/1501 6SM -SHRASN BKN035");
    expect(forecast.forecast[2].type).toBe(WeatherChangeType.FM);
    expect(forecast.forecast[2].raw).toBe(
      "FM150100 25012G25KT P6SM VCSH SCT040 BKN070",
    );
    expect(forecast.forecast[3].type).toBe(WeatherChangeType.FM);
    expect(forecast.forecast[3].raw).toBe("FM150300 26011G21KT P6SM SCT080");
  });

  test("another TAF", () => {
    const taf = parseTAF(
      `
    TAF
          AMD KMSN 152044Z 1521/1618 24009G16KT P6SM SCT100
          TEMPO 1521/1523 BKN100
         FM160000 27008KT P6SM SCT150
         FM160300 30006KT P6SM FEW230
         FM161700 30011G18KT P6SM BKN050
    `,
      { issued: new Date("2022/04/15 21:46") },
    );
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-15T20:44:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T21:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T18:00:00.000Z"));
  });

  describe("should handle CAVOK and", () => {
    test("propagate if only wind changes", () => {
      const taf = parseTAF(
        `
        TAF TAF EHAM 311720Z 3118/0124 12012KT CAVOK
        BECMG 3121/3124 17017KT
        BECMG 0103/0106 21025G35KT
      `,
        { issued: new Date("2022/04/15 21:46") },
      );
      const forecast = getForecastFromTAF(taf);

      expect(forecast.forecast[0].cavok).toBeTruthy();
      expect(forecast.forecast[1].cavok).toBeTruthy();
      expect(forecast.forecast[2].cavok).toBeTruthy();
    });

    test("not propagate if weather changes", () => {
      const taf = parseTAF(
        `
        TAF TAF EHAM 311720Z 3118/0124 12012KT CAVOK
        BECMG 3121/3124 17017KT
        TEMPO 3123/0102 5000 RADZ SCT014 BKN018
        TEMPO 0102/0111 7000 -SHRA SCT020TCU BKN025
        BECMG 0103/0106 21025G35KT
        TEMPO 0106/0109 23028G42KT
        BECMG 0110/0113 21020G30KT -SHRA
        BECMG 0117/0120 20015G25KT
        TEMPO 0117/0124 22023G33KT 5000 SHRA SCT018CB BKN022
      `,
        { issued: new Date("2022/04/15 21:46") },
      );
      const forecast = getForecastFromTAF(taf);

      expect(forecast.forecast[0].cavok).toBeTruthy(); // 12012KT CAVOK
      expect(forecast.forecast[1].cavok).toBeTruthy(); // BECMG 3121/3124 17017KT
      expect(forecast.forecast[2].cavok).toBeFalsy(); // TEMPO 3123/0102 5000 RADZ SCT014 BKN018
      expect(forecast.forecast[3].cavok).toBeFalsy(); // TEMPO 0102/0111 7000 -SHRA SCT020TCU BKN025
      expect(forecast.forecast[4].cavok).toBeTruthy(); // BECMG 0103/0106 21025G35KT
      expect(forecast.forecast[5].cavok).toBeFalsy(); // TEMPO 0106/0109 23028G42KT
      expect(forecast.forecast[6].cavok).toBeFalsy(); // BECMG 0110/0113 21020G30KT -SHRA
      expect(forecast.forecast[7].cavok).toBeFalsy(); // BECMG 0117/0120 20015G25KT
      expect(forecast.forecast[8].cavok).toBeFalsy(); // TEMPO 0117/0124 22023G33KT 5000 SHRA SCT018CB BKN022
    });

    test("not propagate if vertical visibility changes", () => {
      const taf = parseTAF(
        `
        TAF TAF EHAM 311720Z 3118/0124 12012KT CAVOK
        BECMG 3121/3124 17017KT VV001
      `,
        { issued: new Date("2022/04/15 21:46") },
      );
      const forecast = getForecastFromTAF(taf);

      expect(forecast.forecast[0].cavok).toBeTruthy();
      expect(forecast.forecast[1].cavok).toBeFalsy();
    });

    test("not propagate if clouds changes", () => {
      const taf = parseTAF(
        `
        TAF TAF EHAM 311720Z 3118/0124 12012KT CAVOK
        BECMG 3121/3124 17017KT OVC050
      `,
        { issued: new Date("2022/04/15 21:46") },
      );
      const forecast = getForecastFromTAF(taf);

      expect(forecast.forecast[0].cavok).toBeTruthy();
      expect(forecast.forecast[1].cavok).toBeFalsy();
    });

    test("not propagate if visibility changes", () => {
      const taf = parseTAF(
        `
        TAF TAF EHAM 311720Z 3118/0124 12012KT CAVOK
        BECMG 3121/3124 17017KT 5000
      `,
        { issued: new Date("2022/04/15 21:46") },
      );
      const forecast = getForecastFromTAF(taf);

      expect(forecast.forecast[0].cavok).toBeTruthy();
      expect(forecast.forecast[1].cavok).toBeFalsy();
    });
  });

  describe("getCompositeForecastForDate", () => {
    const taf = parseTAF(
      `
    TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
        TEMPO 1500/1501 6SM -SHRASN BKN035
        FM150100 25012G25KT P6SM VCSH SCT040 BKN070
        FM150300 26011G21KT P6SM SCT080
        `,
      { issued: new Date("2022-04-29") },
    );

    const forecast = getForecastFromTAF(taf);

    test("finds TEMPO", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T00:00:00.000Z"),
        forecast,
      );

      expect(composite.prevailing).toBeDefined();
      expect(composite.supplemental).toHaveLength(1);
    });

    test("finds FM @ start, without the TEMPO (exclusive end validity)", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T01:00:00.000Z"),
        forecast,
      );

      expect(composite.prevailing).toBeDefined();
      expect(composite.supplemental).toHaveLength(0);
    });

    test("throws out of bounds", () => {
      expect(() =>
        getCompositeForecastForDate(
          new Date("2023-04-15T00:00:00.000Z"),
          forecast,
        ),
      ).toThrowError(TimestampOutOfBoundsError);

      expect(() =>
        getCompositeForecastForDate(
          new Date("2020-04-15T00:00:00.000Z"),
          forecast,
        ),
      ).toThrowError(TimestampOutOfBoundsError);
    });

    test("NOT throw inclusive start hour", () => {
      expect(() =>
        getCompositeForecastForDate(
          new Date("2022-04-15T00:00:00.000Z"),
          forecast,
        ),
      ).not.toThrowError(TimestampOutOfBoundsError);
    });

    test("throws exclusive end hour", () => {
      expect(() =>
        getCompositeForecastForDate(
          new Date("2022-04-16T00:00:00.000Z"),
          forecast,
        ),
      ).toThrowError(TimestampOutOfBoundsError);
    });
  });
  describe("getCompositeForecastForDate", () => {
    const taf = parseTAF(
      `
    TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
        INTER 1500/1501 6SM -SHRASN BKN035
        FM150100 25012G25KT P6SM VCSH SCT040 BKN070
        FM150300 26011G21KT P6SM SCT080
        `,
      { issued: new Date("2022-04-29") },
    );

    const forecast = getForecastFromTAF(taf);

    test("finds INTER", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T00:00:00.000Z"),
        forecast,
      );

      expect(composite.prevailing).toBeDefined();
      expect(composite.supplemental).toHaveLength(1);
      expect(composite.supplemental[0].type).toBe(WeatherChangeType.INTER);
    });
  });
  describe("with validity start day before issued", () => {
    const taf = parseTAF(
      `
      TAF TAF DNMM 121100Z 1112/1318 22010KT 8000 BKN013 PROB30
      TEMPO 1213/1218 SCT013 FEW020CB
      BECMG 1218/1220 VRB02KT SCT011
      TEMPO 1305/1308 5000 BR HZ
      BECMG 1308/1310 23010KT BKN013
      TEMPO 1312/1317 SCT013 FEW020CB
        `,
      { issued: new Date("2022/11/12 12:51") },
    );

    const forecast = getForecastFromTAF(taf);

    test("has proper start and end", () => {
      expect(forecast.issued).toEqual(new Date("2022-11-12T11:00:00.000Z"));
      expect(forecast.start).toEqual(new Date("2022-11-11T12:00:00.000Z"));
      expect(forecast.end).toEqual(new Date("2022-11-13T18:00:00.000Z"));
    });
  });
});
