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
      new Date("2022-05-01T00:00:00.000Z")
    );
    expect(forecast.forecast[0].end).toEqual(
      new Date("2022-05-02T00:00:00.000Z")
    );
  });

  test("should set maxTemperature, minTemperature, flags", () => {
    const taf = parseTAF(
      `
TAF AMD SBPJ 221450Z 2218/2318 TN25/2309Z TX34/2316Z
    `,
      { issued: new Date("2022-10-22") }
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.maxTemperature?.temperature).toBe(34);
    expect(forecast.maxTemperature?.date).toEqual(
      new Date("2022-10-23T16:00:00.000Z")
    );
    expect(forecast.minTemperature?.temperature).toBe(25);
    expect(forecast.minTemperature?.date).toEqual(
      new Date("2022-10-23T09:00:00.000Z")
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
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-14T23:25:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T00:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T00:00:00.000Z"));

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].start).toEqual(
      new Date("2022-04-15T00:00:00.000Z")
    );
    expect(forecast.forecast[0].end).toEqual(
      new Date("2022-04-15T01:00:00.000Z")
    );
    expect(forecast.forecast[0].end).toEqual(forecast.forecast[2].start);
    expect(forecast.forecast[1].start).toEqual(
      new Date("2022-04-15T00:00:00.000Z")
    );
    expect(forecast.forecast[1].end).toEqual(
      new Date("2022-04-15T02:00:00.000Z")
    );
    expect(forecast.forecast[1].end).not.toEqual(forecast.forecast[2].start);
    expect(forecast.forecast[2].start).toEqual(
      new Date("2022-04-15T01:00:00.000Z")
    );
    expect(forecast.forecast[2].end).toEqual(forecast.forecast[3].start);
    expect(forecast.forecast[3].start).toEqual(
      new Date("2022-04-15T03:00:00.000Z")
    );
    expect(forecast.forecast[3].end).toEqual(
      new Date("2022-04-16T00:00:00.000Z")
    );

    expect(forecast.forecast[forecast.forecast.length - 1].end).toEqual(
      forecast.end
    );
  });

  test("should hydrate BECMG", () => {
    const taf = parseTAF(
      `
TAF SBPJ 221450Z 2218/2318 21006KT 8000 SCT030 FEW040TCU TN25/2309Z TX34/2316Z
  BECMG 2221/2223 VRB03KT FEW030
  BECMG 2302/2304 16003KT 5000 FU RMK PGU
  BECMG 2313/2315 23005KT SCT030 FEW040TCU
    `,
      { issued: new Date("2022-10-22") }
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
      forecast.end
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
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    expect(forecast.forecast).toHaveLength(4);
    expect(forecast.forecast[0].type).toBeUndefined();
    expect(forecast.forecast[0].raw).toBe(
      "TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070"
    );
    expect(forecast.forecast[1].type).toBe(WeatherChangeType.TEMPO);
    expect(forecast.forecast[1].raw).toBe("TEMPO 1500/1501 6SM -SHRASN BKN035");
    expect(forecast.forecast[2].type).toBe(WeatherChangeType.FM);
    expect(forecast.forecast[2].raw).toBe(
      "FM150100 25012G25KT P6SM VCSH SCT040 BKN070"
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
      { issued: new Date("2022/04/15 21:46") }
    );
    const forecast = getForecastFromTAF(taf);

    expect(forecast.issued).toEqual(new Date("2022-04-15T20:44:00.000Z"));
    expect(forecast.start).toEqual(new Date("2022-04-15T21:00:00.000Z"));
    expect(forecast.end).toEqual(new Date("2022-04-16T18:00:00.000Z"));
  });

  describe("getCompositeForecastForDate", () => {
    const taf = parseTAF(
      `
    TAF KMSN 142325Z 1500/1524 25014G30KT P6SM VCSH SCT035 BKN070
        TEMPO 1500/1501 6SM -SHRASN BKN035
        FM150100 25012G25KT P6SM VCSH SCT040 BKN070
        FM150300 26011G21KT P6SM SCT080
        `,
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    test("finds TEMPO", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T00:00:00.000Z"),
        forecast
      );

      expect(composite.prevailing).toBeDefined();
      expect(composite.temporary).toHaveLength(1);
    });

    test("finds FM @ start, without the TEMPO (exclusive end validity)", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T01:00:00.000Z"),
        forecast
      );

      expect(composite.prevailing).toBeDefined();
      expect(composite.temporary).toHaveLength(0);
    });

    test("throws out of bounds", () => {
      expect(() =>
        getCompositeForecastForDate(
          new Date("2023-04-15T00:00:00.000Z"),
          forecast
        )
      ).toThrowError(TimestampOutOfBoundsError);

      expect(() =>
        getCompositeForecastForDate(
          new Date("2020-04-15T00:00:00.000Z"),
          forecast
        )
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
      { issued: new Date("2022-04-29") }
    );

    const forecast = getForecastFromTAF(taf);

    test("finds INTER", () => {
      const composite = getCompositeForecastForDate(
        new Date("2022-04-15T00:00:00.000Z"),
        forecast
      );

      expect(composite.base).toBeDefined();
      expect(composite.additional).toHaveLength(1);
      expect(composite.additional[0].type).toBe(WeatherChangeType.INTER);
    });
  });
});
